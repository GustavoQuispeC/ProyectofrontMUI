"use client";

import { Toaster, ToastBar } from "react-hot-toast";

export default function ToastProvider() {
  // 🎯 Estilos FIJOS (modo claro siempre)
  const bg = "#ffffff";
  const color = "#1e293b";
  const border = "1px solid #e2e8f0";
  const shadow = "0 4px 20px rgba(0,0,0,0.08)";

  return (
    <>
      {/* Animaciones */}
      <style>{`
        @keyframes custom-enter {
          0%   { opacity: 0; transform: translateX(60px) scale(0.95); }
          100% { opacity: 1; transform: translateX(0) scale(1); }
        }
        @keyframes custom-exit {
          0%   { opacity: 1; transform: translateX(0) scale(1); }
          100% { opacity: 0; transform: translateX(60px) scale(0.95); }
        }
      `}</style>

      <Toaster position="top-right" gutter={12}>
        {(t) => (
          <ToastBar
            toast={t}
            style={{
              ...t.style,
              background: bg,
              color,
              border,
              borderRadius: "12px",
              fontSize: "14px",
              fontWeight: "500",
              padding: "12px 16px",
              boxShadow: shadow,
              maxWidth: "380px",
              animation: t.visible ? "custom-enter 0.4s ease" : "custom-exit 0.4s ease forwards",
            }}
          />
        )}
      </Toaster>
    </>
  );
}
