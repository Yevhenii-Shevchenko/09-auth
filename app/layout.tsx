import type { Metadata } from "next";
import { Roboto } from "next/font/google";

import "./globals.css";

import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import TanStackProvider from "@/components/TanStackProvider/TanStackProvider";
import { ReactNode } from "react";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-roboto",
  display: "swap",
});

export const metadata: Metadata = {
  title: "NoteHub",
  description:
    "NoteHub is a simple and efficient application designed for managing personal notes",
  openGraph: {
    title: "NoteHub",
    description:
      "NoteHub is a simple and efficient application designed for managing personal notes",
    url: "https://08-zustand-red-tau.vercel.app/",
    siteName: "NoteHub",
    images: [
      {
        url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
        width: 1200,
        height: 630,
        alt: "NoteHub Open Graph Image",
      },
    ],
  },
};

export default function RootLayout({
  children,
  modal,
}: Readonly<{
  children: ReactNode;
  modal: ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${roboto.variable} ${roboto.variable} h-full antialiased`}
    >
      <body>
        <TanStackProvider>
          <Header />
          <main>{children}</main>
          {modal}
          <Footer />
        </TanStackProvider>
      </body>
    </html>
  );
}
