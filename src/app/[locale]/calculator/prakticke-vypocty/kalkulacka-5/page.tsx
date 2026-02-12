import { redirect } from 'next/navigation';

export default async function CurrencyRedirect({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  redirect(`/${locale}/calculator/currency`);
}
