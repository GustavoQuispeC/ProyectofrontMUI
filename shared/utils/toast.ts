import toast from "react-hot-toast";

export const toastSuccess = (msg: string) => toast.success(msg);

export const toastError = (msg: string) => toast.error(msg);

export const toastInfo = (msg: string) => toast(msg, { icon: "ℹ️" });

export const toastWarning = (msg: string) => toast(msg, { icon: "⚠️" });

// Para acciones async como guardar, eliminar, etc.
export const toastPromise = <T>(
  promise: Promise<T>,
  messages: {
    loading: string;
    success: string;
    error: string;
  },
) =>
  toast.promise(promise, {
    loading: messages.loading,
    success: messages.success,
    error: messages.error,
  });
