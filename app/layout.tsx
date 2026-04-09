import type { Metadata } from "next";
import { Open_Sans, Roboto } from "next/font/google";
import "./globals.css";

const openSans = Open_Sans({
  weight: ["400", "700"],
  subsets: ["latin", "latin-ext"],
  variable: "--font-body",
  display: "swap",
});

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin", "latin-ext"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `Malenovská ${new Date().getFullYear()}`,
    template: `Malenovská ${new Date().getFullYear()} - %s`,
  },
  openGraph: {
    images: ["/og_image.jpg"],
  },
  icons: [
    {
      rel: "icon",
      url: "/favicon-32x32.png",
      sizes: "32x32",
      type: "image/png",
    },
    {
      rel: "icon",
      url: "/favicon-16x16.png",
      sizes: "16x16",
      type: "image/png",
    },
  ],
  other: {
    "theme-color": "#0e0a0a",
  },
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="cs" data-scroll-behavior="smooth" className={`${openSans.variable} ${roboto.variable}`}>
      <body>{children}</body>
    </html>
  );
};

export default RootLayout;
