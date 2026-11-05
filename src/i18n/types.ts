import type es from './locales/es';

type Widen<T> = T extends string
  ? string
  : T extends readonly (infer U)[]
    ? Widen<U>[]
    : { [K in keyof T]: Widen<T[K]> };

/** Forma que todas las traducciones deben cumplir (derivada del español). */
export type Dictionary = Widen<typeof es>;

/** Rutas con punto a valores de texto: "nav.dresses", "products.badges.new"… */
type Paths<T, Prefix extends string = ''> = {
  [K in keyof T & string]: T[K] extends string
    ? `${Prefix}${K}`
    : T[K] extends readonly unknown[]
      ? never
      : Paths<T[K], `${Prefix}${K}.`>;
}[keyof T & string];

export type TranslationKey = Paths<Dictionary>;
