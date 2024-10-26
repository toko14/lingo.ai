import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "next-themes";

export const metadata: Metadata = {
  title: "Lingo.ai",
  description: "AIで効率的に英語を学習",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="default" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
