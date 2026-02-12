import { redirect } from 'next/navigation';

export default async function IdealWeightRedirect({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  redirect(`/${locale}/calculator/ideal-weight`);
}
