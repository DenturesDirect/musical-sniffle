import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SiteConfigProvider } from "@/context/site-config";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SP Site Builder",
  description: "Professional site generator",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SiteConfigProvider>
          {children}
        </SiteConfigProvider>
      </body>
    </html>
  );
}
