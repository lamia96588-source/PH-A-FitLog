"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

const ToastContext = createContext(null);

const TOAST_DURATION_MS = 3200;
const MAX_VISIBLE_TOASTS = 4;

const TYPE_STYLES = {
  success: { dot: "bg-lime-300", card: "border-lime-300/40" },
  warning: { dot: "bg-amber-300", card: "border-amber-300/40" },
  info: { dot: "bg-sky-300", card: "border-sky-300/40" },
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const nextIdRef = useRef(1);

  const dismissToast = useCallback((id) => {
    setToasts((current) => current.filter((item) => item.id !== id));
  }, []);

  const toast = useCallback((message, type = "success") => {
    const id = nextIdRef.current++;
    setToasts((current) =>
      [...current, { id, message, type }].slice(-MAX_VISIBLE_TOASTS)
    );
  }, []);

  const value = useMemo(
    () => ({ toasts, toast, dismissToast }),
    [toasts, toast, dismissToast]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastViewport />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used inside <ToastProvider>");
  }
  return context;
}

function ToastViewport() {
  const { toasts, dismissToast } = useToast();
  if (toasts.length === 0) return null;
  return (
    <div
      aria-live="polite"
      className="fixed right-4 bottom-4 z-50 flex w-72 flex-col gap-2"
    >
      {toasts.map((item) => (
        <ToastCard key={item.id} toast={item} onDismiss={dismissToast} />
      ))}
    </div>
  );
}

function ToastCard({ toast, onDismiss }) {
  useEffect(() => {
    const timer = setTimeout(() => onDismiss(toast.id), TOAST_DURATION_MS);
    return () => clearTimeout(timer);
  }, [toast, onDismiss]);

  const style = TYPE_STYLES[toast.type] ?? TYPE_STYLES.info;

  return (
    <button
      type="button"
      onClick={() => onDismiss(toast.id)}
      className={`animate-[toast-in_0.25s_ease-out] flex cursor-pointer items-center gap-2.5 rounded-lg border bg-zinc-900/95 px-4 py-3 text-left text-sm font-medium text-zinc-100 shadow-lg shadow-black/30 ${style.card}`}
    >
      <span
        className={`h-2 w-2 shrink-0 rounded-full ${style.dot}`}
        aria-hidden="true"
      />
      <span>{toast.message}</span>
    </button>
  );
}
