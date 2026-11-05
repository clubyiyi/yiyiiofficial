import { CampaignTriptych } from '@/components/sections/CampaignTriptych';
import { CategoryGrid } from '@/components/sections/CategoryGrid';
import { CommunityGallery } from '@/components/sections/CommunityGallery';
import { Hero } from '@/components/sections/Hero';
import { Marquee } from '@/components/sections/Marquee';
import { NewArrivals } from '@/components/sections/NewArrivals';
import { SaleSpotlight } from '@/components/sections/SaleSpotlight';
import { ValuesStrip } from '@/components/sections/ValuesStrip';

/**
 * Orden de secciones de la home. Para cambiar la foto del banner:
 *   <Hero image={{ jpg: "/images/otra.jpg", focus: "50% 40%" }} />
 */
export function HomePage() {
  return (
    <>
      <Hero />
      <Marquee />
      <CampaignTriptych />
      <SaleSpotlight />
      <NewArrivals />
      <CategoryGrid />
      <CommunityGallery />
      <ValuesStrip />
    </>
  );
}
