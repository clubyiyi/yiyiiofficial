import { MotionConfig } from 'motion/react';
import { useEffect } from 'react';
import { BrowserRouter, MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';

// En la vista previa empaquetada (un único HTML) no hay rutas en la URL: se usa un router en memoria.
const Router = import.meta.env.VITE_ROUTER === 'memory' ? MemoryRouter : BrowserRouter;
import { I18nProvider, useI18n } from '@/i18n/I18nProvider';
import { CartProvider } from '@/store/CartContext';
import { UIProvider, useUI } from '@/store/UIContext';
import { WishlistProvider } from '@/store/WishlistContext';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { MobileMenu } from '@/components/layout/MobileMenu';
import { SearchOverlay } from '@/components/layout/SearchOverlay';
import { Toast } from '@/components/ui/Toast';
import { CategoryPage } from '@/pages/CategoryPage';
import { HomePage } from '@/pages/HomePage';
import { ProductPage } from '@/pages/ProductPage';
import { WishlistPage } from '@/pages/WishlistPage';

/** Desplaza al ancla (#novedades) o al inicio en cada navegación y cierra paneles abiertos. */
function ScrollManager() {
  const { pathname, hash } = useLocation();
  const { close } = useUI();
  useEffect(() => {
    close();
    if (hash) {
      const id = window.setTimeout(() => document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth' }), 60);
      return () => window.clearTimeout(id);
    }
    window.scrollTo({ top: 0 });
  }, [pathname, hash, close]);
  return null;
}

function Shell() {
  const { t } = useI18n();
  return (
    <>
      <a href="#main" className="skip-link">
        {t('common.skipToContent')}
      </a>
      <ScrollManager />
      <Header />
      <main id="main">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/c/:slug" element={<CategoryPage />} />
          <Route path="/p/:handle" element={<ProductPage />} />
          <Route path="/favoritos" element={<WishlistPage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </main>
      <Footer />
      <SearchOverlay />
      <MobileMenu />
      <CartDrawer />
      <Toast />
    </>
  );
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <I18nProvider>
        <WishlistProvider>
          <CartProvider>
            <UIProvider>
              <Router>
                <Shell />
              </Router>
            </UIProvider>
          </CartProvider>
        </WishlistProvider>
      </I18nProvider>
    </MotionConfig>
  );
}
