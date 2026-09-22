import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "Avenqora IT Support Portal",
  description: "IT Support Portal by Avenqora Technologies",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-950">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}