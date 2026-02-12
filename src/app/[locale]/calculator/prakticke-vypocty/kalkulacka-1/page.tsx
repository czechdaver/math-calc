import { redirect } from 'next/navigation';

export default async function TipRedirect({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  redirect(`/${locale}/calculator/tip`);
}
