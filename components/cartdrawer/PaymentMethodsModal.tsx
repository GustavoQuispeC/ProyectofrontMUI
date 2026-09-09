"use client";

import { useState } from "react";
import Image from "next/image";
import CloseIcon from "@mui/icons-material/Close";
import LockOutlined from "@mui/icons-material/LockOutlined";
import ContentCopy from "@mui/icons-material/ContentCopy";
import Check from "@mui/icons-material/Check";

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

interface PaymentMethodsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PaymentMethodsModal({ isOpen, onClose }: PaymentMethodsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity">
      <div className="relative bg-white w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl transform transition-all">
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute right-4 top-4 w-8 h-8 rounded-lg border border-black/8 flex items-center justify-center text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-colors"
        >
          <CloseIcon sx={{ fontSize: 18 }} />
        </button>

        <div className="p-6 pb-2 pr-14">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-100 text-green-600">
              <LockOutlined sx={{ fontSize: 20 }} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Medios de pago</h3>
              <p className="text-sm text-slate-500">Transfiere o yapea para completar tu pedido</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {/* Transferencia bancaria */}
          <div>
            <p className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-slate-400 mb-2">
              <LockOutlined sx={{ fontSize: 14 }} className="text-yellow-600" />
              Pago con transferencia bancaria
            </p>
            <div className="grid grid-cols-1 gap-2">
              {BANCOS.map((banco) => (
                <div
                  key={banco.id}
                  className="flex items-center gap-3 rounded-xl border border-black/8 bg-slate-50 px-3 py-2.5"
                >
                  <div className="relative w-14 h-10 shrink-0 rounded bg-white border border-black/5 overflow-hidden">
                    <Image src={banco.logo} alt={banco.nombre} fill className="object-contain p-1" sizes="56px" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-slate-700 leading-tight">{banco.nombre}</p>
                    <div className="flex items-center justify-between gap-1">
                      <p className="text-xs text-slate-500 leading-tight truncate">Cta: {banco.cuenta}</p>
                      <CopyField text={banco.cuenta} label="Copiar número de cuenta" />
                    </div>
                    <div className="flex items-center justify-between gap-1">
                      <p className="text-xs text-slate-500 leading-tight truncate">CCI: {banco.cci}</p>
                      <CopyField text={banco.cci} label="Copiar CCI" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Yape / QR */}
          <div className="rounded-xl border border-black/8 bg-[#7620ff]/5 p-4 flex items-center gap-4">
            <div className="relative w-32 h-32 shrink-0 rounded-lg bg-white border border-black/5 overflow-hidden">
              <Image src="/bancos/qr_yape_gf.png" alt="QR Yape" fill className="object-contain p-1" sizes="128px" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="relative w-20 h-8 mb-2">
                <Image src="/bancos/yape-app.png" alt="Yape" fill className="object-contain object-left" sizes="80px" />
              </div>
              <p className="text-sm font-semibold text-slate-700">Escanea el código QR</p>
              <div className="flex items-center gap-1 mt-1">
                <p className="text-xs text-slate-500">o yapea al {YAPE_NUMERO_FORMATEADO}</p>
                <CopyField text={YAPE_NUMERO} label="Copiar número de Yape" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
