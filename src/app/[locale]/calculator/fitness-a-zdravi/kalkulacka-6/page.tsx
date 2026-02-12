import { redirect } from 'next/navigation';

export default async function WaterRedirect({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  redirect(`/${locale}/calculator/fitness-a-zdravi/prijem-vody`);
}
