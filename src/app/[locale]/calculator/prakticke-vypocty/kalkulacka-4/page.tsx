import { redirect } from 'next/navigation';

export default async function TimeRedirect({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  redirect(`/${locale}/calculator/time`);
}
