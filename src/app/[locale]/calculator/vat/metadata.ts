import { Metadata } from 'next';
import { buildCalculatorMetadata } from '@/lib/metadata';

type Props = {
  params: { locale: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = params?.locale || 'cs';
  return buildCalculatorMetadata({ locale, slug: 'vat', urlPath: '/calculator/vat' });
}