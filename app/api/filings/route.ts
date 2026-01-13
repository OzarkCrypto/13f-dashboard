import { NextRequest, NextResponse } from 'next/server';
import { FUNDS, get13FFilings, parse13FHoldings, Holding } from '@/lib/sec-api';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const fund = searchParams.get('fund') || 'duquesne';
  const limit = parseInt(searchParams.get('limit') || '3', 10);
  
  const fundInfo = FUNDS[fund as keyof typeof FUNDS];
  
  if (!fundInfo) {
    return NextResponse.json({ error: 'Invalid fund' }, { status: 400 });
  }
  
  try {
    const filings = await get13FFilings(fundInfo.cik, limit);
    
    // Get holdings for each filing
    const filingsWithHoldings = await Promise.all(
      filings.map(async (filing) => {
        const holdings = await parse13FHoldings(fundInfo.cik, filing.accessionNumber);
        const totalValue = holdings.reduce((sum, h) => sum + h.value, 0);
        
        return {
          ...filing,
          holdings,
          totalValue,
          totalPositions: holdings.length,
        };
      })
    );
    
    return NextResponse.json({
      fund: fundInfo,
      filings: filingsWithHoldings,
    });
    
  } catch (error) {
    console.error('Error fetching 13F data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data' },
      { status: 500 }
    );
  }
}
