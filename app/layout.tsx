import type { Metadata } from "next";
import "./globals.css";
import { scifiFont, defaultFont } from './fonts'
import Navbar from "./components/Navbar";

export const metadata: Metadata = {
  title: "Mind Meld Method",
  description: "Learn Spanish for Devconnect",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${scifiFont.variable} ${defaultFont.variable}`}>
      <body className={defaultFont.className}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
