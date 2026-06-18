import { Geist, Geist_Mono, Manrope } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "react-toastify";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "RecipeHub App",
  description: "RecipeHub App built with Next.js 13, Tailwind CSS",
};

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});
export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      data-theme="light"
      className={` ${manrope.variable} h-full font-sans antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
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
