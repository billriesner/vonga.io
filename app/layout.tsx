import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vonga | Turn Team Apparel Into Your Most Valuable Channel",
  description: "Vonga turns what fans wear into a living connection, unlocking access, rewards, and experiences every time they show up. The official kit provider for teams overlooked by big brands.",
  keywords: ["sports team apparel", "fan engagement", "team merchandise", "NFC apparel", "sports partnerships"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
