import type { Metadata } from "next";
import "./../globals.css";
import "./../style.css";


export const metadata: Metadata = {
  title: "Blinks Wrapper",
  description: "QuickBlinks provide instant Solana Actions to no-code users: Port Your blinks to DSCVR using our tool!.",
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
      <body>{children}</body>
      {/* {children} */}
    </html>
  );
}
