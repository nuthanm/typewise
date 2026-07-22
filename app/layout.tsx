import type { Metadata } from "next";
import { DM_Sans, Fraunces } from "next/font/google";
import { AdSenseScript } from "@/components/AdSense";
import { CookieConsent } from "@/components/CookieConsent";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Typewise — Company type directory",
    template: "%s | Typewise",
  },
  description:
    "Know your company type before you apply. Product vs service company profiles for job seekers and researchers.",
  openGraph: {
    title: "Typewise — Company type directory",
    description: "Browse product vs service companies. Submit adds or edits without sign-in.",
    siteName: "Typewise",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${dmSans.variable} ${fraunces.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        {children}
        <CookieConsent />
        <AdSenseScript />
      </body>
    </html>
  );
}
