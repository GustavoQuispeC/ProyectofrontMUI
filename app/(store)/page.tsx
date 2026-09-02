"use client";
import { Carousel, HeroSection, Productos, Contactenos, Categorias } from "@/components";
import MostrarMarcas from "@/components/marcas/mostrar-marcas/MostrarMarcas";

export default function Home() {
  //Móvil (16:9): 640x360px o 1280x720px
  const imagenesBannerMobile = [
    "https://firebasestorage.googleapis.com/v0/b/grupofamet-frontend.firebasestorage.app/o/carousel%2FBANNER_5_MOVIL.webp?alt=media&token=b851abe4-dee5-4628-bf5e-bc80e5c7b9e3",
    "https://firebasestorage.googleapis.com/v0/b/grupofamet-frontend.firebasestorage.app/o/carousel%2FBANNER_6_MOVIL.webp?alt=media&token=12a0cb31-f76b-4542-8fc4-2c6aa279750f",
    "https://firebasestorage.googleapis.com/v0/b/grupofamet-frontend.firebasestorage.app/o/carousel%2FBANNER_7_MOVIL.webp?alt=media&token=1d444c08-f489-4728-ac81-c078c87b173a",
    "https://firebasestorage.googleapis.com/v0/b/grupofamet-frontend.firebasestorage.app/o/carousel%2FBANNER_8_MOVIL.webp?alt=media&token=dbd08ce3-12f6-4570-af0f-b67c67bb5410",
  ];

  //Desktop (25:9): 1920x691px o 2560x922px
  const imagenesBannerDesktop = [
    "https://firebasestorage.googleapis.com/v0/b/grupofamet-frontend.firebasestorage.app/o/carousel%2FBANNER_1.webp?alt=media&token=ecbaa358-ac43-4024-906f-4a002597e992",
    "https://firebasestorage.googleapis.com/v0/b/grupofamet-frontend.firebasestorage.app/o/carousel%2FBANNER_2.webp?alt=media&token=e83aeec2-e556-47e2-816b-adf12996a7ea",
    "https://firebasestorage.googleapis.com/v0/b/grupofamet-frontend.firebasestorage.app/o/carousel%2FBANNER_3.webp?alt=media&token=e27d14ea-942b-43e9-b6bb-d7723a2dbc71",
    "https://firebasestorage.googleapis.com/v0/b/grupofamet-frontend.firebasestorage.app/o/carousel%2FBANNER_4.webp?alt=media&token=61dde4da-3b0a-4654-a3d0-121a1f66a1c6",
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <main className="grow">
        <Carousel mobileImages={imagenesBannerMobile} desktopImages={imagenesBannerDesktop} />
        <Categorias />
        <Productos />
        <HeroSection />
        <MostrarMarcas />
        <Contactenos />
      </main>
    </div>
  );
}
