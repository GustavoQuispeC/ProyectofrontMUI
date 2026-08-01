"use client";
import { Carousel, Categorias, Gallery, Marcas, Productos, Contactenos } from "@/components";
export default function Home() {
  //Móvil (16:9): 640x360px o 1280x720px
  const imagenesBannerMobile = [
    "https://firebasestorage.googleapis.com/v0/b/grupofamet-456604.firebasestorage.app/o/Carousel%2FCAROUSEL_1.png?alt=media&token=a5218405-7e1c-4e24-a996-07d33845c113",
    "https://firebasestorage.googleapis.com/v0/b/grupofamet-456604.firebasestorage.app/o/Carousel%2FCAROUSEL_2.png?alt=media&token=399808d1-f1d3-4b5e-b1cf-bcb729467b9b",
    "https://firebasestorage.googleapis.com/v0/b/grupofamet-456604.firebasestorage.app/o/Carousel%2FCAROUSEL_3.png?alt=media&token=65e1c03d-1dfc-47b7-8ed7-9c654daff179",
  ];

  //Desktop (25:9): 1920x691px o 2560x922px
  const imagenesBannerDesktop = [
    "https://firebasestorage.googleapis.com/v0/b/grupofamet-456604.firebasestorage.app/o/Carousel%2FCAROUSEL_1.png?alt=media&token=a5218405-7e1c-4e24-a996-07d33845c113",
    "https://firebasestorage.googleapis.com/v0/b/grupofamet-456604.firebasestorage.app/o/Carousel%2FCAROUSEL_2.png?alt=media&token=399808d1-f1d3-4b5e-b1cf-bcb729467b9b",
    "https://firebasestorage.googleapis.com/v0/b/grupofamet-456604.firebasestorage.app/o/Carousel%2FCAROUSEL_3.png?alt=media&token=65e1c03d-1dfc-47b7-8ed7-9c654daff179",
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <main className="grow">
        <Carousel mobileImages={imagenesBannerMobile} desktopImages={imagenesBannerDesktop} />
        <Categorias />

        <Productos />
        <Gallery />
        <Marcas />
        <Contactenos />
      </main>
    </div>
  );
}
