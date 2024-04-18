import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { RemoteProvider } from "@/remote.store";
import { LocalProvider } from "@/local.store";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Baby Blue",
  description: "",
  manifest: "/site.webmanifest",
  icons: {
    icon: "/favicon/favicon-32x32.png",
    shortcut: "/favicon/favicon-16x16.png",
    apple: "/favicon/apple-touch-icon.png",
  },
};

export default function ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <TooltipProvider>
          <LocalProvider>
            <RemoteProvider>{children}</RemoteProvider>
          </LocalProvider>
        </TooltipProvider>
      </body>
    </html>
  );
}
