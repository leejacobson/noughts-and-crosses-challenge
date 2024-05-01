import type { Metadata } from "next";
import { Indie_Flower } from "next/font/google";
import "./globals.scss";

const indieFlower = Indie_Flower({ weight: '400', subsets: ['latin'] });

export const metadata: Metadata = {
  title: "Noughts and Crosses",
  description: "A Noughts and Crosses game",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={indieFlower.className}>{children}</body>
    </html>
  );
}
