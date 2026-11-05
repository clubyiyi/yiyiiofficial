import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';

type Panel = 'cart' | 'search' | 'menu' | null;

interface UIValue {
  panel: Panel;
  open: (panel: Exclude<Panel, null>) => void;
  close: () => void;
  toast: string | null;
  notify: (message: string) => void;
}

const UIContext = createContext<UIValue | null>(null);

/** Estado de interfaz compartido: qué panel está abierto (bolsa, búsqueda, menú) y avisos. */
export function UIProvider({ children }: { children: ReactNode }) {
  const [panel, setPanel] = useState<Panel>(null);
  const [toast, setToast] = useState<string | null>(null);
  const timer = useRef<number>();

  const open = useCallback((p: Exclude<Panel, null>) => setPanel(p), []);
  const close = useCallback(() => setPanel(null), []);
  const notify = useCallback((message: string) => {
    setToast(message);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setToast(null), 2800);
  }, []);

  useEffect(() => {
    document.body.classList.toggle('is-locked', panel !== null);
    if (!panel) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setPanel(null);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [panel]);

  const value = useMemo(() => ({ panel, open, close, toast, notify }), [panel, open, close, toast, notify]);
  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}

export function useUI() {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error('useUI must be used inside <UIProvider>');
  return ctx;
}
