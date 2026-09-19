import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Providers from "./providers";

const geistSans = localFont({
  src: "../public/fonts/Geist.woff2",
  variable: "--font-geist-sans",
  display: "swap",
  fallback: ["system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
});

const geistMono = localFont({
  src: "../public/fonts/GeistMono.woff2",
  variable: "--font-geist-mono",
  display: "swap",
  fallback: ["ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "monospace"],
});

const cooperLtBT = localFont({
  src: [
    {
      path: "../public/fonts/CooperLtBT_Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/CooperLtBT_Italic.ttf",
      weight: "400",
      style: "italic",
    },
  ],
  variable: "--font-cooper",
  display: "swap",
  fallback: ["Georgia", "Times New Roman", "serif"],
});

export const metadata: Metadata = {
  title: "Microworks: Micro-tasks, Micro-wins · Monad",
  description:
    "A micro-task marketplace on Monad. Post a task, verify with a golden key, and pay workers instantly — label, vote, verify, caption, earn.",
};

export const viewport: Viewport = {
  themeColor: "#fafaf9",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${cooperLtBT.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-stone-50 text-stone-900 font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}