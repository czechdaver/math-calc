import { redirect } from 'next/navigation';

export default async function FuelRedirect({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  redirect(`/${locale}/calculator/fuel`);
}
