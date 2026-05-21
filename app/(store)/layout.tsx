import CartDrawer from "@/components/cartdrawer/Cartdrawer";
import Footer from "@/components/ui/footer/Footer";
import Navbar from "@/components/ui/navbar/Navbar";
import ScrollToTop from "@/components/ui/scrollToTop/ScrollToTop";
import Whatsapp from "@/components/ui/whatsapp/Whatsapp";

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />

      {children}
      <Whatsapp />
      <ScrollToTop />
      <Footer />
      <CartDrawer />
    </>
  );
}