"use client";
import {
  Add,
  Check,
  ContentCopy,
  DeleteOutlined,
  Inventory2Outlined,
  LockOutlined,
  Receipt,
  Remove,
  ShoppingCart,
} from "@mui/icons-material";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import CloseIcon from "@mui/icons-material/Close";

const CART_KEY = "shopping_cart";
const CART_EVENT = "cart:updated";
export const DRAWER_OPEN_EVENT = "drawer:open";

const BANCOS = [
  {
    id: "bcp",
    nombre: "BCP",
    logo: "/bancos/banco-de-credito-logo.png",
    cuenta: "2902066737021",
    cci: "002-29000206673702155",
  },
  {
    id: "bbva",
    nombre: "BBVA",
    logo: "/bancos/bbva-logo.png",
    cuenta: "0011-0347-0100056132",
    cci: "011-347-000100056132-22",
  },
  {
    id: "bn",
    nombre: "Banco de la Nación",
    logo: "/bancos/banco-de-la-nacion-logo.png",
    cuenta: "00-261-038021",
    cci: "01826100026103802180",
  },
];

const YAPE_NUMERO = "979394237";
const YAPE_NUMERO_FORMATEADO = "979 394 237";

type CartItem = {
  id: number;
  nombre: string;
  imagen: string;
  precio: number;
  cantidad: number;
};

type CartMap = Record<string, CartItem>;

function safeParseJSON<T>(value: string | null, fallback: T): T {
  try {
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}

function CopyField({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Ignorar errores de portapapeles (ej. permisos denegados)
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      title={copied ? "Copiado" : "Copiar"}
      className="inline-flex shrink-0 items-center justify-center rounded p-0.5 text-slate-400 transition-colors hover:bg-slate-200 hover:text-slate-700"
    >
      {copied ? <Check sx={{ fontSize: 12 }} /> : <ContentCopy sx={{ fontSize: 12 }} />}
      <span className="sr-only">{label}</span>
    </button>
  );
}

function formatMoney(amount: number): string {
  return new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN",
    minimumFractionDigits: 2,
  }).format(amount);
}

function readCart(): CartMap {
  if (typeof window === "undefined") return {};
  return safeParseJSON<CartMap>(localStorage.getItem(CART_KEY), {});
}

function writeCart(cart: CartMap) {
  if (typeof window === "undefined") return;
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  window.dispatchEvent(new Event(CART_EVENT));
}

function cartToArray(cart: CartMap): CartItem[] {
  return Object.values(cart);
}

function getTotalQty(cart: CartMap): number {
  return Object.values(cart).reduce((acc, it) => acc + (it.cantidad || 0), 0);
}

function setQty(productId: number, qty: number) {
  const cart = readCart();
  const key = String(productId);
  if (qty <= 0) {
    delete cart[key];
    writeCart(cart);
    return;
  }
  if (!cart[key]) return;
  cart[key] = { ...cart[key], cantidad: qty };
  writeCart(cart);
}

function clearCart() {
  writeCart({});
}

/* ─── CartButton ─────────────────────────────────────────── */
export function CartButton() {
  const [badgeQty, setBadgeQty] = useState(0);

  useEffect(() => {
    const refresh = () => setBadgeQty(getTotalQty(readCart()));
    refresh();
    const onStorage = (e: StorageEvent) => {
      if (e.key === CART_KEY) refresh();
    };
    window.addEventListener("storage", onStorage);
    window.addEventListener(CART_EVENT, refresh);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener(CART_EVENT, refresh);
    };
  }, []);

  return (
    <button
      type="button"
      aria-label="Carrito"
      onClick={() => window.dispatchEvent(new Event(DRAWER_OPEN_EVENT))}
      className="relative flex h-12 w-12 items-center justify-center rounded-full hover:bg-black/5 transition-colors"
    >
      <ShoppingCart className="h-6 w-6 text-orange-500" />
      {badgeQty > 0 && (
        <span className="absolute top-0.5 right-0.5 flex min-w-4.5 h-4.5 items-center justify-center rounded-full bg-red-600 px-1 text-[11px] font-extrabold text-white">
          {badgeQty > 99 ? "99+" : badgeQty}
        </span>
      )}
    </button>
  );
}

/* ─── DrawerComponent ────────────────────────────────────── */
export default function DrawerComponent() {
  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState<CartItem[]>([]);
  const [badgeQty, setBadgeQty] = useState(0);

  const onClose = () => setIsOpen(false);
  useEffect(() => {
    const refresh = () => {
      const cart = readCart();
      setItems(cartToArray(cart));
      setBadgeQty(getTotalQty(cart));
    };

    refresh();

    const onStorage = (e: StorageEvent) => {
      if (e.key === CART_KEY) refresh();
    };

    const onOpen = () => setIsOpen(true);

    window.addEventListener("storage", onStorage);
    window.addEventListener(CART_EVENT, refresh);
    window.addEventListener(DRAWER_OPEN_EVENT, onOpen);

    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener(CART_EVENT, refresh);
      window.removeEventListener(DRAWER_OPEN_EVENT, onOpen);
    };
  }, []);

  // Cerrar con Escape
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen]);

  // Bloquear scroll del body
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const subtotal = useMemo(() => items.reduce((acc, it) => acc + it.precio * it.cantidad, 0), [items]);

  //! Enviar mensaje de WhatsApp con el pedido
  const handleSendWhatsApp = () => {
    if (items.length === 0) return;

    const EMOJI_WAVE = "\u{1F44B}";
    const EMOJI_CALENDAR = "\u{1F4C5}";
    const EMOJI_CART = "\u{1F6D2}";
    const EMOJI_MONEY = "\u{1F4B0}";
    const EMOJI_NOTE = "\u{1F4DD}";

    const date = new Date().toLocaleDateString("es-PE", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

    let message = `${EMOJI_WAVE} Hola, quiero realizar el siguiente pedido:\n\n`;
    message += `${EMOJI_CALENDAR} *Fecha:* ${date}\n\n`;
    message += `${EMOJI_CART} *Productos:*\n`;

    items.forEach((item, index) => {
      const total = item.precio * item.cantidad;
      message += `${index + 1}. *${item.nombre}*\n`;
      message += `   Cantidad: ${item.cantidad} unid.\n`;
      message += `   Precio unitario: ${formatMoney(item.precio)}\n`;
      message += `   Subtotal: ${formatMoney(total)}\n\n`;
    });

    message += `${EMOJI_MONEY} *Total a pagar:* ${formatMoney(subtotal)}\n\n`;
    message += `${EMOJI_NOTE} Pedido generado desde la web de *Grupo Famet S.A.C.*\n`;
    message += `¡Gracias por su preferencia!`;

    const phone = "51904193374";
    const url = `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  //! Incrementar cantidad
  const inc = (id: number) => {
    const it = items.find((x) => x.id === id);
    if (it) setQty(id, it.cantidad + 1);
  };

  const dec = (id: number) => {
    const it = items.find((x) => x.id === id);
    if (it) setQty(id, it.cantidad - 1);
  };

  const onManualQty = (id: number, raw: string) => {
    if (raw.trim() === "") {
      setQty(id, 0);
      return;
    }
    const n = Number(raw);
    if (!Number.isFinite(n)) return;
    setQty(id, Math.max(0, Math.floor(n)));
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={[
          "fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
        ].join(" ")}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Carrito de compras"
        className={[
          "fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col",
          "bg-white",
          "shadow-2xl transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "translate-x-full",
        ].join(" ")}
      >
        <div className="flex items-center justify-between px-5 py-4.5 border-b border-black/5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl border border-black/5 bg-slate-50 flex items-center justify-center">
              <ShoppingCart className="w-4.5 h-4.5 text-slate-700" />
            </div>
            <div>
              <p className="text-[15px] font-medium text-slate-900 flex items-center gap-2">
                Tu carrito
                <span className="inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full bg-blue-900 text-white text-[11px] font-medium">
                  {badgeQty}
                </span>
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                {badgeQty} {badgeQty === 1 ? "producto seleccionado" : "productos seleccionados"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar carrito"
            className="w-8 h-8 rounded-lg border border-black/8 flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors"
          >
            <CloseIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-4 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
          {items.length === 0 ? (
            <div className="rounded-2xl border border-black/5 bg-slate-50 p-6 text-center">
              <p className="font-semibold text-slate-800">Tu carrito está vacío</p>
              <button
                type="button"
                onClick={onClose}
                className="mt-4 rounded-xl bg-orange-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-700 transition-colors"
              >
                Seguir comprando
              </button>
            </div>
          ) : (
            <ul className="space-y-3">
              {items.map((it) => (
                <li
                  key={it.id}
                  className="rounded-xl border border-black/5 bg-white p-3.5 flex gap-3 hover:border-black/10 transition-colors"
                >
                  <div className="w-14 h-14 shrink-0 rounded-lg border border-black/5 bg-slate-50 flex items-center justify-center overflow-hidden relative">
                    <Image src={it.imagen} alt={it.nombre} fill className="object-contain p-1.5" sizes="56px" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium text-slate-900 truncate">{it.nombre}</p>
                    <p className="text-xs text-slate-500 mt-0.5">S/ {it.precio.toFixed(2)} por unidad</p>

                    <div className="flex items-center gap-2 mt-2.5">
                      {/* Qty control */}
                      <div className="inline-flex items-center h-7.5 rounded-lg border border-black/8 bg-slate-50 overflow-hidden">
                        <button
                          type="button"
                          onClick={() => dec(it.id)}
                          aria-label="Disminuir"
                          className="w-7 h-full flex items-center justify-center text-slate-500 hover:bg-black/5 transition-colors text-base leading-none"
                        >
                          <Remove sx={{ fontSize: 14 }} />
                        </button>
                        <input
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          min={0}
                          value={it.cantidad}
                          onChange={(e) => onManualQty(it.id, e.target.value.replace(/\D/g, ""))}
                          className="bg-transparent text-center text-[13px] font-medium text-slate-900 outline-none px-1 min-w-8 max-w-20 w-full"
                        />
                        <button
                          type="button"
                          onClick={() => inc(it.id)}
                          aria-label="Aumentar"
                          className="w-7 h-full flex items-center justify-center text-slate-500 hover:bg-black/5 transition-colors"
                        >
                          <Add sx={{ fontSize: 14 }} />
                        </button>
                      </div>

                      {/* Delete */}
                      <button
                        type="button"
                        onClick={() => setQty(it.id, 0)}
                        className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-red-500 hover:bg-red-50 px-2 py-1 rounded-lg transition-all"
                      >
                        <DeleteOutlined sx={{ fontSize: 14 }} />
                        Eliminar
                      </button>
                    </div>
                  </div>

                  <div className="text-right shrink-0 flex flex-col justify-between items-end">
                    <span className="text-[11px] text-slate-400">Subtotal</span>
                    <span className="text-[15px] font-medium text-slate-900 tabular-nums">
                      S/ {(it.precio * it.cantidad).toFixed(2)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Métodos de pago */}
        <div className="border-t border-black/5 px-4 pt-3 pb-2 space-y-3">
          {/* Bancos (pequeña) */}
          <div>
            <p className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wide text-slate-400 mb-1.5">
              <LockOutlined sx={{ fontSize: 12 }} className="text-yellow-600" />
              Pago con transferencia bancaria
            </p>
            <div className="grid grid-cols-1 gap-1.5">
              {BANCOS.map((banco) => (
                <div
                  key={banco.id}
                  className="flex items-center gap-2 rounded-lg border border-black/8 bg-slate-50 px-2 py-1.5"
                >
                  <div className="relative w-12 h-9 shrink-0 rounded bg-white border border-black/5 overflow-hidden">
                    <Image src={banco.logo} alt={banco.nombre} fill className="object-contain p-1" sizes="48px" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-semibold text-slate-700 leading-tight">{banco.nombre}</p>
                    <div className="flex items-center justify-between gap-1">
                      <p className="text-[10px] text-slate-500 leading-tight truncate">Cta: {banco.cuenta}</p>
                      <CopyField text={banco.cuenta} label="Copiar número de cuenta" />
                    </div>
                    <div className="flex items-center justify-between gap-1">
                      <p className="text-[10px] text-slate-500 leading-tight truncate">CCI: {banco.cci}</p>
                      <CopyField text={banco.cci} label="Copiar CCI" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Yape / QR (grande) */}
          <div className="rounded-xl border border-black/8 bg-[#7620ff]/5 p-3 flex items-center gap-3">
            <div className="relative w-28 h-28 shrink-0 rounded-lg bg-white border border-black/5 overflow-hidden">
              <Image src="/bancos/qr_yape_gf.png" alt="QR Yape" fill className="object-contain p-1" sizes="112px" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="relative w-20 h-8 mb-1.5">
                <Image src="/bancos/yape-app.png" alt="Yape" fill className="object-contain object-left" sizes="80px" />
              </div>
              <p className="text-xs font-semibold text-slate-700">Escanea el código QR</p>
              <div className="flex items-center gap-1">
                <p className="text-[11px] text-slate-500">o yapea al {YAPE_NUMERO_FORMATEADO}</p>
                <CopyField text={YAPE_NUMERO} label="Copiar número de Yape" />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-black/5 px-4 py-3.5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <span className="flex items-center gap-1.5 text-xs text-slate-500">
                <Receipt sx={{ fontSize: 14 }} />
                Total a pagar
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] text-slate-400 bg-slate-50 border border-black/5 rounded-full px-2 py-0.5">
                <Inventory2Outlined sx={{ fontSize: 11 }} />
                {items.reduce((a, i) => a + i.cantidad, 0)} unidades · {items.length} productos
              </span>
            </div>
            <span className="text-[22px] font-medium text-blue-900 tabular-nums tracking-tight">
              S/ {subtotal.toFixed(2)}
            </span>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              disabled={items.length === 0}
              onClick={() => clearCart()}
              className="flex items-center justify-center gap-1.5 h-10 px-4 rounded-lg border border-black/8 text-[13px] font-medium text-slate-600 hover:text-red-600 hover:border-red-200 hover:bg-red-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <DeleteOutlined sx={{ fontSize: 16 }} />
              Vaciar
            </button>

            <button
              type="button"
              disabled={items.length === 0}
              onClick={handleSendWhatsApp}
              className="relative flex-1 flex items-center justify-center gap-2.5 h-10 rounded-lg bg-[#25D366] hover:bg-[#1ebe5d] active:scale-[0.98] text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all overflow-hidden group"
            >
              <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-linear-to-r from-transparent via-white/15 to-transparent transition-transform duration-500" />
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 shrink-0">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.122 1.532 5.856L.054 23.447a.5.5 0 0 0 .612.612l5.595-1.479A11.95 11.95 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.885 0-3.656-.51-5.184-1.4l-.371-.22-3.85 1.017 1.018-3.737-.242-.386A9.96 9.96 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
              </svg>
              <span className="flex flex-col items-start leading-tight">
                <span className="text-[13px] font-medium">Enviar pedido</span>
                <span className="text-[10px] opacity-75">Abrir WhatsApp</span>
              </span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
