import Banner from "@/components/banner/Banner";
import CartDrawer from "@/components/cartdrawer/Cartdrawer";
import Footer from "@/components/ui/footer/Footer";
import Navbar from "@/components/ui/navbar/Navbar";
import ScrollToTop from "@/components/ui/scrollToTop/ScrollToTop";
import Whatsapp from "@/components/ui/whatsapp/Whatsapp";

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Banner />
      <Navbar />

      {children}
      <Whatsapp />
      <ScrollToTop />
      <Footer />
      <CartDrawer />
    </>
  );
}
