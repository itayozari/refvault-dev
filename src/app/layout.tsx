import type { Metadata } from "next";
import { Inter } from 'next/font/google';
import "./globals.css";
import Script from "next/script";

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: "RefVault",
  description: "Your video reference manager",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script id="theme-script" strategy="beforeInteractive">
          {`
            (function() {
              function getTheme() {
                const storedTheme = localStorage.getItem('theme')
                if (storedTheme) return storedTheme;
                
                return window.matchMedia('(prefers-color-scheme: dark)').matches
                  ? 'dark'
                  : 'light'
              }
              
              const theme = getTheme();
              document.documentElement.classList.toggle('dark', theme === 'dark');
            })()
          `}
        </Script>
      </head>
      <body className={`${inter.variable} font-sans antialiased bg-[var(--background)] text-[var(--text)]`}>
        {children}
      </body>
    </html>
  );
}
