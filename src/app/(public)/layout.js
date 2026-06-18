import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";


export default function PublicLayout({ children }) {

    return (

        <div className="min-h-screen flex flex-col">
          <Navbar />

            <main>
                {children}
            </main>
            <Footer/>


        </div>
    );
}