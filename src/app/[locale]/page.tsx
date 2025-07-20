import React from 'react';
import { useTranslation } from 'react-i18next';
import AdBanner from '@/components/ads/AdBanner'; // Import the AdBanner component

interface HomePageProps {
  params: { locale: string };
}

const HomePage: React.FC<HomePageProps> = ({ params }) => {
  const { t } = useTranslation(params.locale, 'common');

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 7. Reklamní plochy - Header banner */}
      <AdBanner placement="header" />

      {/* 2. Hero Sekce */}
      <section className="text-center my-12">
        <h1 className="text-4xl font-bold mb-4">{t('homepage.hero.title')}</h1>
        <p className="text-xl text-gray-600 mb-8">{t('homepage.hero.subtitle')}</p>
        {/* TODO: Add illustration/animation */}
        {/* TODO: Add CTA button */}
      </section>

      {/* 7. Reklamní plochy - In-content */}
      <AdBanner placement="in-content" />

      {/* 3. Nejpoužívanější kalkulačky (rozcezstník) */}
      <section className="my-12">
        <h2 className="text-2xl font-bold mb-6">{t('homepage.mostUsedCalculators.title')}</h2>
        {/* TODO: Implement Most Used Calculators grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-100 p-6 rounded">Placeholder Kalkulačka 1</div>
          <div className="bg-gray-100 p-6 rounded">Placeholder Kalkulačka 2</div>
          <div className="bg-gray-100 p-6 rounded">Placeholder Kalkulačka 3</div>
        </div>
      </section>

      {/* 7. Reklamní plochy - Sidebar (Desktop only) - Placement on homepage might differ, often in main layout */}
       {/* TODO: Integrate AdBanner for sidebar in the appropriate parent layout */}

      {/* 4. Kategorie kalkulaček */}
      <section className="my-12">
        <h2 className="text-2xl font-bold mb-6">{t('homepage.categories.title')}</h2>
        {/* TODO: Implement Categories grid */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gray-100 p-6 rounded">Placeholder Kategorie 1</div>
          <div className="bg-gray-100 p-6 rounded">Placeholder Kategorie 2</div>
          <div className="bg-gray-100 p-6 rounded">Placeholder Kategorie 3</div>
          <div className="bg-gray-100 p-6 rounded">Placeholder Kategorie 4</div>
        </div>
      </section>

      {/* 6. Trust & Proof sekce */}
      <section className="my-12">
        <h2 className="text-2xl font-bold mb-6">{t('homepage.trustProof.title')}</h2>
        {/* TODO: Implement Trust & Proof section (testimonials, logos, etc.) */}
         <div className="bg-gray-100 p-6 rounded text-center">Placeholder Trust & Proof</div>
      </section>

       {/* 7. Reklamní plochy - Footer banner */}
       <AdBanner placement="in-content" /> {/* Using in-content placement for now, adjust as needed */}

      {/* 9. Adblock Modal - Placeholder (Should likely be in a higher-level layout)*/}
      {/* TODO: Implement Adblock Modal component in root layout */}

      {/* 10. FAQ blok */}
      <section className="my-12">
        <h2 className="text-2xl font-bold mb-6">{t('homepage.faq.title')}</h2>
        {/* TODO: Implement FAQ Accordion */}
         <div className="bg-gray-100 p-6 rounded">Placeholder FAQ</div>
      </section>

       {/* 7. Reklamní plochy - Sticky bottom bar (Mobile only) - Should likely be in a higher-level layout */}
       {/* TODO: Integrate AdBanner for sticky bottom in the appropriate parent layout */}

      {/* 8. Footer - Will likely be in a higher-level layout */}
      {/* TODO: Implement Footer in root layout */}

      {/* 11. Tracking & Analytics - Handled in the page component or a hook */}
      {/* 12. Testing Strategy - Handled separately */}
      {/* 13. Maintenance & Scaling - Handled separately */}
      {/* 14. Legal & Compliance - Handled separately */}
      {/* 15. Launch Strategy - Handled separately */}
    </div>
  );
};

export default HomePage;
