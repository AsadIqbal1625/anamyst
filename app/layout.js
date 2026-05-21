import "./globals.css";
import Script
from "next/script";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className="min-h-screen flex flex-col font-sans">
        <Navbar />
        {children}
        <Footer />
       <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      </body>
    </html>
  );
}