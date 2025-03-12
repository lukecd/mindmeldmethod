import type { Metadata } from "next";
import "./globals.css";
import { titleFont, bodyFont } from './fonts'
import Navbar from './components/Navbar'

export const metadata: Metadata = {
  title: "Mind Meld Method",
  description: "Learn Spanish for Devconnect",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${titleFont.variable}`}>
      <body className={bodyFont.className}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
