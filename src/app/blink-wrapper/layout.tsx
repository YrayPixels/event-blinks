import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./../globals.css";
import "./../style.css";
import AppWalletProvider from "@/components/walletAdapter/AppWalletProvider";


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
      <body><AppWalletProvider>{children}</AppWalletProvider></body>
      {/* {children} */}
    </html>
  );
}
