"use client";

import Image from "next/image";

const GALLERY_IMAGES = [
  {
    src: "https://readymadeui.com/images/gallery-img-1.webp",
    colSpan: 3,
  },
  {
    src: "https://readymadeui.com/images/furniture-img.webp",
    colSpan: 6,
  },
  {
    src: "https://readymadeui.com/images/gallery-img-6.webp",
    colSpan: 1,
  },
  {
    src: "https://readymadeui.com/images/gallery-img-4.webp",
    colSpan: 1,
  },
  {
    src: "https://readymadeui.com/images/real-estate-img.webp",
    colSpan: 6,
  },
  {
    src: "https://readymadeui.com/images/gallery-img-5.webp",
    colSpan: 3,
  },
];

export default function Gallery() {
  return (
    <section className="hidden md:block px-4 md:px-8 mt-6">
      <div className="max-w-7xl mx-auto">
        <div className="space-y-6">
          {/* Primera fila: 3 cols + 6 cols */}
          <div className="grid md:grid-cols-9 gap-6">
            <div className="w-full md:h-75 md:col-span-3 relative">
              <Image
                src={GALLERY_IMAGES[0].src}
                alt="Gallery image 1"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 33vw, 33vw"
                className="rounded-lg object-cover object-top"
              />
            </div>
            <div className="w-full md:h-75 md:col-span-6 relative">
              <Image
                src={GALLERY_IMAGES[1].src}
                alt="Furniture image"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 66vw, 66vw"
                className="rounded-lg object-cover object-top"
              />
            </div>
          </div>

          {/* Segunda fila: 2 cols */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="w-full md:h-75 relative">
              <Image
                src={GALLERY_IMAGES[2].src}
                alt="Gallery image 6"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="rounded-lg object-cover object-top"
              />
            </div>
            <div className="w-full md:h-75 relative">
              <Image
                src={GALLERY_IMAGES[3].src}
                alt="Gallery image 4"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="rounded-lg object-cover object-top"
              />
            </div>
          </div>

          {/* Tercera fila: 6 cols + 3 cols */}
          <div className="grid md:grid-cols-9 gap-6">
            <div className="w-full md:h-75 md:col-span-6 relative">
              <Image
                src={GALLERY_IMAGES[4].src}
                alt="Real estate image"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 66vw, 66vw"
                className="rounded-lg object-cover object-top"
              />
            </div>
            <div className="w-full md:h-75 md:col-span-3 relative">
              <Image
                src={GALLERY_IMAGES[5].src}
                alt="Gallery image 5"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 33vw, 33vw"
                className="rounded-lg object-cover object-top"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
