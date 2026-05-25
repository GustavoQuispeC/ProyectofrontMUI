"use client";

import { useEffect, useState } from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
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

  useEffect(() => {
    setCantidad(getCartItemQuantity(producto.id) ?? 1);
  }, [producto.id]);

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
      <div className="bg-white dark:bg-gray-900 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden transform transition-all">
        <div className="flex items-center gap-3 p-6 pb-2">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
            <CheckCircleIcon />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">¡Producto agregado!</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Se añadió al carrito correctamente</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-white">
            <RemoveIcon className="rotate-45" />
          </button>
        </div>

        <div className="p-6">
          <div className="flex items-start gap-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
            <div className="shrink-0 w-24 h-24 bg-white dark:bg-gray-700 rounded-lg p-2 flex items-center justify-center">
              <img src={producto.imagen} alt={producto.nombre} className="w-full h-full object-contain" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-blue-900 dark:text-white mb-1 line-clamp-2">{producto.nombre}</h4>
              <p className="text-2xl font-extrabold text-orange-500 mb-3">S/ {producto.precio.toFixed(2)}</p>

              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Cantidad:</span>
                <div className="flex items-center border-2 border-gray-200 dark:border-gray-600 rounded-xl overflow-hidden bg-white dark:bg-gray-700">
                  <button
                    onClick={disminuir}
                    className="px-3 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  >
                    <RemoveIcon sx={{ fontSize: 16 }} className="text-gray-700 dark:text-gray-300" />
                  </button>
                  <input
                    type="number"
                    value={cantidad}
                    onChange={(e) => handleChange(e.target.value)}
                    className="w-12 text-center outline-none bg-transparent font-semibold text-gray-900 dark:text-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <button
                    onClick={incrementar}
                    className="px-3 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  >
                    <AddIcon sx={{ fontSize: 16 }} className="text-gray-700 dark:text-gray-300" />
                  </button>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600 flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Subtotal:</span>
                <span className="text-xl font-bold text-blue-900 dark:text-white">
                  S/ {(producto.precio * cantidad).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 pt-0 flex flex-col sm:flex-row justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2.5 font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
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
