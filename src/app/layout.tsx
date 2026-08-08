import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import DarkModeToggle from "@/components/DarkModeToggle";

export const metadata: Metadata = {
  title: "Shinobi",
  description: "Modern design system with custom themes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <header className="flex justify-between items-center p-4 bg-surface border-b border-border">
          <div className="flex items-center gap-6">
            <Link href="/" className="text-3xl font-semibold text-foreground no-underline">
              Shinobi
            </Link>
            <nav className="flex items-center gap-4 text-sm text-muted">
              <Link href="/blog" className="hover:text-primary">Blog</Link>
              <Link href="/about" className="hover:text-primary">About</Link>
              <Link href="/preview" className="hover:text-primary">Preview</Link>
            </nav>
          </div>
          <DarkModeToggle />
        </header>
        {children}
      </body>
    </html>
  );
}
