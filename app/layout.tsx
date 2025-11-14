import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import { AuthProvider } from "./components/shared/AuthContext";
import UserMenu from "./components/shared/UserMenu";
import NavigationHeader from "./components/shared/NavigationHeader";
import ContentWrapper from "./components/shared/ContentWrapper";
import "./globals.css";
import "./styles.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700", "800"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Herald BMS",
  description: "Upload, store and management of your documents securely with Herald BMS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" style={{ margin: 0, padding: 0 }}>
      <body className={`${inter.variable} antialiased`} style={{ margin: 0, padding: 0, overflow: 'auto' }}>
        <AuthProvider>
          <NavigationHeader />
          <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            fontFamily: '-apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, \'Helvetica Neue\', Arial, sans-serif'
          }}>
            <ContentWrapper>
              {children}
            </ContentWrapper>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
