import { NextRequest, NextResponse } from 'next/server';
import ExcelJS from 'exceljs';
import nodemailer from 'nodemailer';

// Create Excel workbook from extraction data
async function createExcelBuffer(data: any) {
    const workbook = new ExcelJS.Workbook();

    // Risk Values Sheet
    if (data.risk_values && data.risk_values.length > 0) {
        const riskSheet = workbook.addWorksheet('Risk Parameters');
        riskSheet.columns = [
            { header: 'Parameter ID', key: 'risk_parameter_id', width: 25 },
            { header: 'Value', key: 'value', width: 30 },
        ];
        riskSheet.addRows(data.risk_values);

        // Style header row
        riskSheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
        riskSheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E3C72' } };
    }

    // Coverage Values Sheet
    if (data.coverage_values && data.coverage_values.length > 0) {
        const coverageSheet = workbook.addWorksheet('Coverage Parameters');
        coverageSheet.columns = [
            { header: 'Parameter ID', key: 'coverage_parameter_id', width: 25 },
            { header: 'Value', key: 'value', width: 30 },
        ];
        coverageSheet.addRows(data.coverage_values);

        // Style header row
        coverageSheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
        coverageSheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E3C72' } };
    }

    // Summary Sheet
    const summarySheet = workbook.addWorksheet('Summary');
    summarySheet.columns = [
        { header: 'Property', key: 'property', width: 20 },
        { header: 'Value', key: 'value', width: 40 },
    ];

    const summary = [
        { property: 'Extraction ID', value: data.id || 'N/A' },
        { property: 'Status', value: data.status || 'N/A' },
        { property: 'Created At', value: data.created_at || 'N/A' },
        { property: 'Updated At', value: data.updated_at || 'N/A' },
        { property: 'Risk Parameters Count', value: data.risk_values?.length || 0 },
        { property: 'Coverage Parameters Count', value: data.coverage_values?.length || 0 },
    ];

    summarySheet.addRows(summary);
    summarySheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
    summarySheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E3C72' } };

    const buffer = await workbook.xlsx.writeBuffer();
    return buffer;
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { action, extractionData, recipientEmail } = body;

        if (action === 'download') {
            // Generate Excel file for download
            const buffer = await createExcelBuffer(extractionData);

            return new NextResponse(buffer, {
                status: 200,
                headers: {
                    'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                    'Content-Disposition': `attachment; filename="extraction-${new Date().getTime()}.xlsx"`,
                },
            });
        }

        if (action === 'email') {
            if (!recipientEmail) {
                return NextResponse.json(
                    { error: 'Recipient email is required' },
                    { status: 400 }
                );
            }

            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(recipientEmail)) {
                return NextResponse.json(
                    { error: 'Invalid email address' },
                    { status: 400 }
                );
            }

            const buffer = await createExcelBuffer(extractionData);
            const filename = `extraction-${new Date().getTime()}.xlsx`;

            // Configure email transporter
            // Using environment variables for email credentials
            const transporter = nodemailer.createTransport({
                host: process.env.EMAIL_HOST,
                port: parseInt(process.env.EMAIL_PORT || '587'),
                secure: process.env.EMAIL_SECURE === 'true',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASSWORD,
                },
            });

            // Send email
            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: recipientEmail,
                subject: 'Insurance Data Extraction Report',
                html: `
          <h2>Insurance Data Extraction Report</h2>
          <p>Dear User,</p>
          <p>Please find attached the extracted insurance data from your PDF document.</p>
          <p><strong>Extraction Details:</strong></p>
          <ul>
            <li><strong>Status:</strong> ${extractionData.status}</li>
            <li><strong>Extraction ID:</strong> ${extractionData.id}</li>
            <li><strong>Risk Parameters:</strong> ${extractionData.risk_values?.length || 0}</li>
            <li><strong>Coverage Parameters:</strong> ${extractionData.coverage_values?.length || 0}</li>
          </ul>
          <p>Best regards,<br>Insurance Data Extraction System</p>
        `,
                attachments: [
                    {
                        filename: filename,
                        content: buffer as any,
                        contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                    },
                ],
            });

            return NextResponse.json(
                { success: true, message: `Email sent successfully to ${recipientEmail}` },
                { status: 200 }
            );
        }

        return NextResponse.json(
            { error: 'Invalid action' },
            { status: 400 }
        );
    } catch (error) {
        console.error('Export error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Export failed' },
            { status: 500 }
        );
    }
}
