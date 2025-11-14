interface StatusProps {
    status: string;
    size?: 'small' | 'normal';
}

export default function StatusBadge({ status, size = 'normal' }: StatusProps) {
    const colors: Record<string, string> = {
        'Uploaded': '#e3f2fd',
        'Extraction Pending': '#fff3e0',
        'Extracted': '#e8f5e9'
    };
    const textColors: Record<string, string> = {
        'Uploaded': '#1976d2',
        'Extraction Pending': '#e65100',
        'Extracted': '#2e7d32'
    };

    const padding = size === 'small' ? '2px 8px' : '4px 12px';
    const fontSize = size === 'small' ? '10px' : '12px';

    return (
        <span style={{
            display: 'inline-block',
            padding,
            borderRadius: '15px',
            fontSize,
            fontWeight: 600,
            background: colors[status] || '#f0f0f0',
            color: textColors[status] || '#666',
            lineHeight: '1.2'
        }}>
            {status}
        </span>
    );
}