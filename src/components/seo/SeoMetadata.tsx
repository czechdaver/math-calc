// src/components/seo/SeoMetadata.tsx
import Head from 'next/head';
import { useTranslation } from 'next-i18next';

interface SeoMetadataProps {
  title: string;
  description: string;
  // TODO: Přidat další relevantní SEO meta tagy (např. keywords, Open Graph, Twitter Cards, canonical URL)
  // TODO: Přidat props pro Schema.org data, např. schemaData: object
}

const SeoMetadata: React.FC<SeoMetadataProps> = ({ title, description /*, schemaData*/ }) => {
   const { i18n } = useTranslation();
  const currentLocale = i18n.language;

  // TODO: Dynamicky generovat Schema.org JSON-LD
  const schemaMarkup = {}; // Placeholder

  return (
    <Head>
      <title>{title} | MathCalc Pro</title> {/* TODO: Doplnit název projektu z lokalizace */}
      <meta name="description" content={description} />
      {/* TODO: Přidat dynamické keywords meta tag */}
      {/* TODO: Přidat Open Graph a Twitter Cards meta tagy */}
      {/* TODO: Přidat canonical URL meta tag */}

      {/* Meta tag pro jazyk stránky */}
      <meta property="og:locale" content={currentLocale} />
       {/* TODO: Přidat alternate language tagy pro Hreflang */}

      {/* Placeholder pro Schema.org JSON-LD */}
      {/* TODO: Doplnit reálná data do schemaMarkup a zvážit typ "Calculator" */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }}
      />
    </Head>
  );
};

export default SeoMetadata;
