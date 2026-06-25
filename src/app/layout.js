import { Geist, Geist_Mono, Manrope } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import BootScreen from "@/components/BootScreen";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

export const metadata = {
  title: "RecipeHub App",
  description: "RecipeHub App built with Next.js 15, Tailwind CSS",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      data-theme="light"
      className={`${manrope.variable} h-full font-sans antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {/* 🌟 Mounts on top of all UI nodes to capture initial boot hydration */}
        

        {children}
        <BootScreen />git
        
        
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </body>
    </html>
  );
}