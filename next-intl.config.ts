import {getRequestConfig} from 'next-intl/server';

export default getRequestConfig(async ({locale}) => {
  // Fallback to 'cs' if locale is undefined
  const validLocale = locale || 'cs';
  
  return {
    locale: validLocale,
    messages: (await import(`./src/messages/${validLocale}.json`)).default
  };
});
