import { DM_Sans, Manrope } from "next/font/google";

import "./globals.css";
import "./top-range.css";

import SiteChrome from "@/components/SiteChrome";

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
  title: "Top Range Building Materials",
  description:
    "Quality construction materials, reliable supply and quotation solutions.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        id="top"
        className={`${dmSans.variable} ${manrope.variable} bg-[#F5F5F0] text-[#101411] antialiased`}
      >
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
