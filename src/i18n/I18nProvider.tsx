import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Locale, LocalizedText, Money } from '@/types/commerce';
import { brand } from '@/config/brand';
import es from './locales/es';
import en from './locales/en';
import type { Dictionary, TranslationKey } from './types';

/** Añadir un idioma: crea `locales/xx.ts` tipado como `Dictionary` y regístralo aquí y en `Locale`. */
export const dictionaries: Record<Locale, Dictionary> = { es, en };
export const locales: Locale[] = ['es', 'en'];

const STORAGE_KEY = 'mc.locale';
const intlLocale: Record<Locale, string> = { es: 'es-ES', en: 'en-GB' };

type Vars = Record<string, string | number>;

interface I18nValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  /** Traduce una clave con interpolación `{{var}}`. */
  t: (key: TranslationKey, vars?: Vars) => string;
  /** Plural simple: usa la clave `<key>One` cuando count === 1. */
  tp: (key: TranslationKey, count: number, vars?: Vars) => string;
  /** Diccionario completo, útil para listas (mensajes promo, columnas…). */
  dict: Dictionary;
  /** Resuelve textos del catálogo. */
  tr: (text: LocalizedText) => string;
  formatMoney: (money: Money) => string;
}

const I18nContext = createContext<I18nValue | null>(null);

const interpolate = (template: string, vars?: Vars) =>
  vars ? template.replace(/\{\{(\w+)\}\}/g, (_, name: string) => String(vars[name] ?? '')) : template;

const resolve = (dict: Dictionary, key: string): string => {
  const value = key.split('.').reduce<unknown>((node, part) => (node as Record<string, unknown>)?.[part], dict);
  return typeof value === 'string' ? value : key;
};

const initialLocale = (): Locale => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY) as Locale | null;
    if (stored && locales.includes(stored)) return stored;
  } catch {
    /* almacenamiento no disponible */
  }
  const browser = navigator.language.slice(0, 2) as Locale;
  return locales.includes(browser) ? browser : brand.defaultLocale;
};

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* noop */
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.title = dictionaries[locale].meta.title;
  }, [locale]);

  const value = useMemo<I18nValue>(() => {
    const dict = dictionaries[locale];
    const money = new Map<string, Intl.NumberFormat>();
    return {
      locale,
      setLocale,
      dict,
      t: (key, vars) => interpolate(resolve(dict, key), vars),
      tp: (key, count, vars) => {
        const one = `${key}One`;
        const template = count === 1 && resolve(dict, one) !== one ? resolve(dict, one) : resolve(dict, key);
        return interpolate(template, { count, ...vars });
      },
      tr: (text) => text[locale] ?? text[brand.defaultLocale],
      formatMoney: ({ amount, currency }) => {
        if (!money.has(currency)) {
          money.set(currency, new Intl.NumberFormat(brand.moneyLocale ?? intlLocale[locale], { style: 'currency', currency }));
        }
        return money.get(currency)!.format(amount / 100);
      },
    };
  }, [locale, setLocale]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used inside <I18nProvider>');
  return ctx;
}
