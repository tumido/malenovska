import type { Metadata } from "next";
import { Amatic_SC, Open_Sans } from "next/font/google";
import "./globals.css";

const amaticSC = Amatic_SC({
  weight: "700",
  subsets: ["latin", "latin-ext"],
  variable: "--font-display",
  display: "swap",
});

const openSans = Open_Sans({
  weight: ["400", "700"],
  subsets: ["latin", "latin-ext"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `Malenovsk\u00e1 ${new Date().getFullYear()}`,
    template: `Malenovsk\u00e1 ${new Date().getFullYear()} - %s`,
  },
  openGraph: {
    images: ["/og_image.jpg"],
  },
  icons: [
    { rel: "icon", url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    { rel: "icon", url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
  ],
  other: {
    "theme-color": "#0e0a0a",
  },
};

const RootLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <html lang="cs" className={`${amaticSC.variable} ${openSans.variable}`}>
      <body>{children}</body>
    </html>
  );
};

export default RootLayout;
