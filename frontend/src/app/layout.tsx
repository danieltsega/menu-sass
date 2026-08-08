import type { Metadata } from "next";
import { inter } from "@/lib/fonts";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { QueryProvider } from "@/components/providers/query-provider";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "MenuSass — Digital Cafe Menus",
  description: "Beautiful digital menus for cafes and restaurants. Scan, browse, and order the modern way.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full bg-background text-foreground font-sans">
        <ThemeProvider>
          <QueryProvider>
            {children}
          </QueryProvider>
          <Toaster position="top-center" />
        </ThemeProvider>
      </body>
    </html>
  );
}