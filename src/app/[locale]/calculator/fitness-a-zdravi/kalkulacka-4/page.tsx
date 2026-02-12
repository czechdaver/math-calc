import { redirect } from 'next/navigation';

export default async function BodyFatRedirect({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  redirect(`/${locale}/calculator/body-fat`);
}
