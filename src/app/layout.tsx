import type { Metadata } from "next";
import "./globals.css";
import CustomCursor from "@/components/ui/CustomCursor";
import GlobalSoundInitializer from "@/components/ui/GlobalSoundInitializer";

export const metadata: Metadata = {
  title: "nytrixis.dos",
  description: "Portfolio operating system interface",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <GlobalSoundInitializer />
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}
