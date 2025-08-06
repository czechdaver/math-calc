import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const RATINGS_FILE_PATH = path.join(process.cwd(), 'public/data/ratings.json');

// GET - načtení všech hodnocení
export async function GET() {
  try {
    const fileContent = fs.readFileSync(RATINGS_FILE_PATH, 'utf8');
    const data = JSON.parse(fileContent);
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error reading ratings file:', error);
    return NextResponse.json(
      { error: 'Failed to load ratings' },
      { status: 500 }
    );
  }
}

// POST - inkrementace hodnocení
export async function POST(request: NextRequest) {
  try {
    const { calculatorId, rating } = await request.json();
    
    // Validace vstupních dat
    if (!calculatorId || !rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Invalid calculator ID or rating value' },
        { status: 400 }
      );
    }
    
    // Načtení aktuálních dat
    const fileContent = fs.readFileSync(RATINGS_FILE_PATH, 'utf8');
    const data = JSON.parse(fileContent);
    
    // Inicializace kalkulačky pokud neexistuje
    if (!data.ratings[calculatorId]) {
      data.ratings[calculatorId] = {
        "1": 0,
        "2": 0,
        "3": 0,
        "4": 0,
        "5": 0
      };
    }
    
    // Inkrementace příslušného counteru
    data.ratings[calculatorId][rating.toString()]++;
    
    // Aktualizace metadat
    data.lastUpdated = new Date().toISOString();
    
    // Uložení zpět do souboru
    fs.writeFileSync(RATINGS_FILE_PATH, JSON.stringify(data, null, 2));
    
    // Výpočet nového průměru a celkového počtu pro response
    const calculatorRatings = data.ratings[calculatorId];
    const totalCount = Object.values(calculatorRatings).reduce((sum: number, count) => sum + (count as number), 0);
    const weightedSum = Object.entries(calculatorRatings).reduce(
      (sum, [star, count]) => sum + (parseInt(star) * (count as number)), 
      0
    );
    const averageRating = totalCount > 0 ? weightedSum / totalCount : 0;
    
    return NextResponse.json({
      success: true,
      calculatorId,
      newRating: rating,
      totalCount,
      averageRating: Math.round(averageRating * 10) / 10, // Zaokrouhlení na 1 desetinné místo
      updatedCounters: calculatorRatings
    });
    
  } catch (error) {
    console.error('Error updating ratings:', error);
    return NextResponse.json(
      { error: 'Failed to update rating' },
      { status: 500 }
    );
  }
}
