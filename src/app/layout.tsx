import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "./style.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Quick Blinks",
  description: "QuickBlinks provide instant Solana Actions to no-code users,  you can receive payment in any token, collect donations, mint nfts, Create an event Register and more.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* <!-- Indicates that the application is a Canvas --> */}
      <meta name="dscvr:canvas:version" content="vNext" />
      {/* <!-- Open Graph Image for previewing the Canvas --> */}
      <meta name="og:image" content="https://my-canvas.com/preview-image.png" />
      <body>{children}</body>
    </html>
  );
}
