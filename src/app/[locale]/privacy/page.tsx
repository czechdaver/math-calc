import { useTranslations } from 'next-intl';

const PrivacyPolicyPage: React.FC = () => {
  const t = useTranslations('privacy_policy');

  return (
    <div className="container mx-auto p-4 max-w-4xl py-12">
      <h1 className="text-3xl font-bold mb-6">{t('title')}</h1>
      <div className="prose dark:prose-invert max-w-none">
        {t('content').split('\n\n').map((paragraph, index) => (
          <p key={index} className="mb-4 whitespace-pre-wrap">{paragraph}</p>
        ))}
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
