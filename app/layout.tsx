import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import { AuthProvider } from "./components/shared/AuthContext";
import UserMenu from "./components/shared/UserMenu";
import NavigationHeader from "./components/shared/NavigationHeader";
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
          <NavigationHeader />
          <div className="main-content">
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
