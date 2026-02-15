import { NextRequest, NextResponse } from 'next/server';
import { searchCalculators } from '@/lib/calculatorDataUtils';
import { getTranslations } from 'next-intl/server';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');
    const locale = searchParams.get('locale') || 'cs';

    if (!query || query.trim().length === 0) {
        return NextResponse.json({ results: [] });
    }

    // Get translations server-side for the specified locale
    const t = await getTranslations({ locale, namespace: '' });

    // Perform search
    const results = searchCalculators(query, locale, t);

    return NextResponse.json({ results });
}
