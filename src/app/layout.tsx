import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "내가 교수님",
  description: "AI 기반 학습문제 생성 플랫폼",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased
          text-white transition-colors duration-200 px-4 sm:px-8 md:px-16 lg:px-32 xl:px-[120px] py-6 sm:py-8 md:py-12 lg:py-16 xl:py-[24px] pb-16 sm:pb-20 md:pb-32 lg:pb-40 xl:pb-[180px]`}
        style={{
          background: 'linear-gradient(180deg, #404D61 0.9%, #1D1C25 100%)'
        }}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
