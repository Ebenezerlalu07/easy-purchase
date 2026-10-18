import { DM_Sans, Manrope } from "next/font/google";

import "./globals.css";
import "./top-range.css";

import SiteChrome from "@/components/SiteChrome";
import PWARegister from "@/components/PWARegister";
import InstallAppPrompt from "@/components/InstallAppPrompt";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata = {
  title: "Easy Purchase",

  description:
    "Quality construction materials, reliable supply and quotation solutions.",

  manifest: "/manifest.webmanifest",

  appleWebApp: {
    capable: true,
    statusBarStyle: "black",
    title: "Easy Purchase",
  },

  icons: {
    icon: [
      {
        url: "/public/icons/icon.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        url: "/public/icons/icon.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],

    apple: [
      {
        url: "/public/icons/icon.png",
        sizes: "192x192",
        type: "image/png",
      },
    ],
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#07100D",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        id="top"
        className={`${dmSans.variable} ${manrope.variable} bg-[#F5F5F0] text-[#101411] antialiased`}
      >
        <PWARegister />

        <InstallAppPrompt />

        <SiteChrome>
          {children}
        </SiteChrome>
      </body>
    </html>
  );
}