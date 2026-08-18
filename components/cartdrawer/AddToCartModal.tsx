"use client";

import { useState } from "react";
import Image from "next/image";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import CloseIcon from "@mui/icons-material/Close";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { DRAWER_OPEN_EVENT } from "@/components/cartdrawer/Cartdrawer";
import { CartProduct, getCartItemQuantity, removeCartItem, upsertCartItem } from "@/components/cartdrawer/cartService";

interface AddToCartModalProps {
  isOpen: boolean;
  onClose: () => void;
  producto: CartProduct;
}

export default function AddToCartModal({ isOpen, onClose, producto }: AddToCartModalProps) {
  const [cantidad, setCantidad] = useState(() => getCartItemQuantity(producto.id) ?? 1);

  const syncStorage = (qty: number) => {
    if (qty <= 0) {
      removeCartItem(producto.id);
    } else {
      upsertCartItem(producto, qty);
    }
  };

  const incrementar = () => {
    const next = cantidad + 1;
    setCantidad(next);
    syncStorage(next);
  };

  const disminuir = () => {
    const next = Math.max(0, cantidad - 1);
    setCantidad(next);
    syncStorage(next);
  };

  const handleChange = (value: string) => {
    const n = Number(value);
    if (!Number.isFinite(n)) return;
    const next = Math.max(0, Math.floor(n));
    setCantidad(next);
    syncStorage(next);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity">
      <div className="relative bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden transform transition-all">
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute right-4 top-4 w-8 h-8 rounded-lg border border-black/8 flex items-center justify-center text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-colors"
        >
          <CloseIcon sx={{ fontSize: 18 }} />
        </button>

        <div className="flex items-center gap-3 p-6 pb-2 pr-14">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-100 text-green-600">
            <CheckCircleIcon />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-slate-900">¡Producto agregado!</h3>
            <p className="text-sm text-slate-500">Se añadió al carrito correctamente</p>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-start gap-6 p-4 bg-slate-50 rounded-xl border border-black/5">
            <div className="relative shrink-0 w-24 h-24 bg-white rounded-lg border border-black/5 p-2">
              <Image
                src={producto.imagen}
                alt={producto.nombre}
                fill
                className="object-contain p-2"
                sizes="96px"
                unoptimized
              />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-blue-900 mb-1 line-clamp-2">{producto.nombre}</h4>
              <p className="text-2xl font-extrabold text-orange-500 mb-3">S/ {producto.precio.toFixed(2)}</p>

              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-slate-600">Cantidad:</span>
                <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-white">
                  <button onClick={disminuir} className="px-3 py-1.5 hover:bg-slate-100 transition-colors">
                    <RemoveIcon sx={{ fontSize: 16 }} className="text-slate-700" />
                  </button>
                  <input
                    type="number"
                    value={cantidad}
                    onChange={(e) => handleChange(e.target.value)}
                    className="w-12 text-center outline-none bg-transparent font-semibold text-slate-900 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <button onClick={incrementar} className="px-3 py-1.5 hover:bg-slate-100 transition-colors">
                    <AddIcon sx={{ fontSize: 16 }} className="text-slate-700" />
                  </button>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-200 flex justify-between items-center">
                <span className="text-sm font-medium text-slate-600">Subtotal:</span>
                <span className="text-xl font-bold text-blue-900">S/ {(producto.precio * cantidad).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 pt-0 flex flex-col sm:flex-row justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2.5 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
          >
            Seguir comprando
          </button>
          <button
            onClick={() => {
              onClose();
              window.dispatchEvent(new Event(DRAWER_OPEN_EVENT));
            }}
            className="flex items-center justify-center gap-2 bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold px-6 py-2.5 rounded-xl shadow-md transition-all"
          >
            Ir al carrito
            <ArrowForwardIcon sx={{ fontSize: 18 }} />
          </button>
        </div>
      </div>
    </div>
  );
}
