import { redirect } from 'next/navigation';

export default async function MacroRedirect({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  redirect(`/${locale}/calculator/fitness-a-zdravi/makro-kalkulator`);
}
