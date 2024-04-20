import "./globals.css";

import type { Metadata } from "next";
import { Inter, Montserrat_Alternates } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import { RemoteProvider } from "@/remote.store";
import { LocalProvider } from "@/local.store";

const font = Montserrat_Alternates({
  subsets: ["latin"],
  weight: ["200", "400", "500", "600", "700"],
  variable: "--body",
});

export const metadata: Metadata = {
  title: "Bloom",
  description: "",
  manifest: "/site.webmanifest",
  icons: {
    icon: "/favicon/favicon-32x32.png",
    shortcut: "/favicon/favicon-16x16.png",
    apple: "/favicon/apple-touch-icon.png",
  },
};

export default async function ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={font.className}>
        <TooltipProvider>
          <LocalProvider>
            <RemoteProvider>{children}</RemoteProvider>
          </LocalProvider>
        </TooltipProvider>
      </body>
    </html>
  );
}
