"use client";

import { Carousel, Navbar, Footer } from "@/components";
import Categorias from "../components/categorias/categorias";

export default function Home() {
  const imagenesBanner = [
    "https://firebasestorage.googleapis.com/v0/b/grupofamet-456604.firebasestorage.app/o/Carousel%2FCAROUSEL_1.png?alt=media&token=a5218405-7e1c-4e24-a996-07d33845c113",
    "https://firebasestorage.googleapis.com/v0/b/grupofamet-456604.firebasestorage.app/o/Carousel%2FCAROUSEL_2.png?alt=media&token=399808d1-f1d3-4b5e-b1cf-bcb729467b9b",
    "https://firebasestorage.googleapis.com/v0/b/grupofamet-456604.firebasestorage.app/o/Carousel%2FCAROUSEL_3.png?alt=media&token=65e1c03d-1dfc-47b7-8ed7-9c654daff179",
  ];

  return (
    /* 1. min-h-screen asegura que el contenedor mida al menos el alto de la pantalla */
    /* 2. flex flex-col permite que los hijos se apilen verticalmente */
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* 3. flex-grow hace que este contenedor crezca y empuje el footer al final */}
      <main className="grow">
        <Carousel images={imagenesBanner} />
        <Categorias />
      </main>

      <Footer />
    </div>
  );
}
