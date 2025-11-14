import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import { AuthProvider } from "./components/shared/AuthContext";
import UserMenu from "./components/shared/UserMenu";
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
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <AuthProvider>
          <div className="upload-container">
            <header className="header">
              <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
                  <Link href="/upload" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <h1 style={{ cursor: 'pointer', margin: 0 }}>Herald</h1>
                  </Link>
                  <nav style={{ display: 'flex', gap: '20px' }}>
                    <Link href="/upload" style={{ color: '#666', textDecoration: 'none', fontSize: '14px', fontWeight: 500 }}>Upload</Link>
                    <Link href="/history" style={{ color: '#666', textDecoration: 'none', fontSize: '14px', fontWeight: 500 }}>History</Link>
                  </nav>
                </div>
                <UserMenu />
              </div>
            </header>
            <div className="main-content">
              {children}
            </div>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
