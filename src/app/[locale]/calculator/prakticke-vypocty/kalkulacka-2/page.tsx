import { redirect } from 'next/navigation';

export default async function DiscountRedirect({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  redirect(`/${locale}/calculator/discount`);
}
