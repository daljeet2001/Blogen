"use client";

import "./globals.css";
import { Nunito } from "next/font/google";
import Providers from "./components/Providers";
import Appbar from "./components/Appbar";
import { Toaster } from "react-hot-toast"
import Footer from "./components/Footer";

import { usePathname } from "next/navigation";

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

 const hideFooter =
    pathname === "/" 
 

  return (
    <html lang="en">
      <body className={nunito.className + " bg-gray-50 min-h-screen"}>
   
          <Providers>
            <Appbar />
            <main className="max-w-4xl mx-auto p-4">{children}</main>
             <Toaster position="top-center" />
      
   
            {hideFooter && <Footer />}
          </Providers>
      
      </body>
    </html>
  );
}
