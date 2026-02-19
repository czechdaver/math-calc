import { useTranslations } from 'next-intl';

const PrivacyPolicyPage: React.FC = () => {
  const t = useTranslations('privacy_policy');

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">{t('title')}</h1>
      <p>{t('content')}</p>
      {/* TODO: Přidat detailní obsah zásad ochrany osobních údajů */}
    </div>
  );
};

export default PrivacyPolicyPage;
