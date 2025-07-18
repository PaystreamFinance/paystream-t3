import { GeistSans } from "geist/font/sans";
import { Darker_Grotesque } from "next/font/google";
import localFont from "next/font/local";
import { type Metadata } from "next";

import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import "@/styles/globals.css";
import { TRPCReactProvider } from "@/trpc/react";
import AppWalletProvider from "@/components/AppWalletProvider";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Paystream",
  description: "Paystream, Smarter lending Easier borrowing",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const darkerGrotesque = Darker_Grotesque({
  subsets: ["latin"],
  variable: "--font-darker-grotesque",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const helvetica = localFont({
  src: "../fonts/helvetica/Helvetica.ttf",
  variable: "--font-helvetica",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${darkerGrotesque.variable} ${helvetica.variable}`}
    >
      <AppWalletProvider>
        <body className="overflow-x-hidden bg-bg-t3 bg-[url('/bg-noise.svg')]">
          <Toaster position="bottom-right"/>
          <TRPCReactProvider>
            <Navbar />
            {children}
            <Footer />
          </TRPCReactProvider>
        </body>
      </AppWalletProvider>
    </html>
  );
}
