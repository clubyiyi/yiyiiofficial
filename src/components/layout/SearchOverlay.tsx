import { useEffect, useRef, useState } from 'react';
import { useI18n } from '@/i18n/I18nProvider';
import { useProducts } from '@/hooks/useProducts';
import { useUI } from '@/store/UIContext';
import { Drawer } from '@/components/ui/Drawer';
import { Icon } from '@/components/ui/Icon';
import { ProductGrid } from '@/components/ui/ProductGrid';
import styles from './SearchOverlay.module.css';

function useDebounced<T>(value: T, ms = 220) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = window.setTimeout(() => setDebounced(value), ms);
    return () => window.clearTimeout(id);
  }, [value, ms]);
  return debounced;
}

/** Búsqueda en vivo contra el adaptador de comercio. */
export function SearchOverlay() {
  const { t, tp, dict } = useI18n();
  const { panel, close } = useUI();
  const [term, setTerm] = useState('');
  const input = useRef<HTMLInputElement>(null);
  const query = useDebounced(term.trim());
  const { products, loading } = useProducts({ search: query, limit: 8 });
  const isOpen = panel === 'search';

  useEffect(() => {
    if (isOpen) window.setTimeout(() => input.current?.focus(), 120);
    else setTerm('');
  }, [isOpen]);

  return (
    <Drawer open={isOpen} onClose={close} side="top" title={t('search.title')}>
      <div className="container">
        <label className={styles.field}>
          <Icon name="search" />
          <span className="visually-hidden">{t('nav.search')}</span>
          <input
            ref={input}
            type="search"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder={t('nav.searchPlaceholder')}
          />
        </label>

        <div className={styles.chips}>
          <span>{t('search.suggestions')}:</span>
          {dict.search.popular.map((word) => (
            <button key={word} type="button" onClick={() => setTerm(word)}>
              {word}
            </button>
          ))}
        </div>

        {query && (
          <div className={styles.results}>
            <p className={styles.count}>
              {loading
                ? t('common.loading')
                : products.length
                  ? tp('search.results', products.length)
                  : t('search.noResults', { term: query })}
            </p>
            <div onClick={(e) => (e.target as HTMLElement).closest('a') && close()}>
              <ProductGrid products={products} loading={loading} />
            </div>
          </div>
        )}
      </div>
    </Drawer>
  );
}
