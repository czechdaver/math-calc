import { redirect } from 'next/navigation';
import { headers } from 'next/headers';

const SUPPORTED_LOCALES = ['cs', 'hu', 'pl', 'sk'];
const DEFAULT_LOCALE = 'cs';

export default async function Page() {
  const headersList = await headers();
  const acceptLanguage = headersList.get('accept-language');

  let locale = DEFAULT_LOCALE;
  if (acceptLanguage) {
    const languages = acceptLanguage.split(',').map(lang => lang.split(';')[0]);
    for (const lang of languages) {
      if (SUPPORTED_LOCALES.includes(lang)) {
        locale = lang;
        break;
      }
    }
  }

  redirect(`/${locale}`);
}