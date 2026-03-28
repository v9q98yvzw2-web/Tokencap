import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TokenCap - Crypto Token Market Cap Tracker",
  description: "Real-time cryptocurrency prices, market caps, and charts. Track thousands of tokens live.",
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen font-sans">{children}</body>
    </html>
  );
}
