import { redirect } from 'next/navigation';

export default async function CaloriesRedirect({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  redirect(`/${locale}/calculator/calories`);
}
