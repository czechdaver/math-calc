import { redirect } from 'next/navigation';

interface ProcentaRedirectProps {
  params: Promise<{ locale: string }>;
}

export default async function ProcentaRedirect({ params }: ProcentaRedirectProps) {
  const { locale } = await params;
  // Redirect to the most popular percentage calculator (percentage of number)
  redirect(`/${locale}/calculator/procenta/procento-z-cisla`);
}
