import { NextRequest, NextResponse } from 'next/server';
import { getRelatedCalculators } from '@/lib/calculatorDataUtils';
import { useTranslations } from 'next-intl';

// We need to use a trick to get translations in the API route or just use the keys
// Since calculatorDataUtils uses a translation function, we'll need to adapt it
// or instantiate a simple translation helper if we want to return translated text.
// However, next-intl usually works in Server Components or Client Components.
// For API routes, we might need a different approach or accept that we return keys
// and translate on client, OR we just use a basic mapping if we have the messages.

// BUT, calculatorDataUtils expects a t() function.
// Let's see if we can import messages directly.

import messagesCs from '@/messages/cs.json';
import messagesSk from '@/messages/sk.json';
import messagesEn from '@/messages/en.json';

const messages: Record<string, any> = {
    cs: messagesCs,
    sk: messagesSk,
    en: messagesEn
};

function getTranslator(locale: string) {
    const localeMessages = messages[locale] || messages['cs'];

    return (key: string) => {
        const keys = key.split('.');
        let result = localeMessages;
        for (const k of keys) {
            if (result && typeof result === 'object' && k in result) {
                result = result[k];
            } else {
                return key; // Fallback to key if not found
            }
        }
        return result as string;
    };
}

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    const locale = searchParams.get('locale') || 'cs';

    if (!id) {
        return NextResponse.json({ error: 'Calculator ID is required' }, { status: 400 });
    }

    try {
        const t = getTranslator(locale);
        const related = getRelatedCalculators(id, locale, t);

        return NextResponse.json(related);
    } catch (error) {
        console.error('Error fetching related calculators:', error);
        return NextResponse.json({ error: 'Failed to fetch related calculators' }, { status: 500 });
    }
}
