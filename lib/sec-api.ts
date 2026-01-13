// SEC EDGAR API utilities for 13F filings

export interface Holding {
  nameOfIssuer: string;
  titleOfClass: string;
  cusip: string;
  value: number; // in thousands
  shares: number;
  shrsOrPrnAmt: string;
  investmentDiscretion: string;
  votingAuthority: {
    sole: number;
    shared: number;
    none: number;
  };
}

export interface Filing13F {
  accessionNumber: string;
  filedAt: string;
  reportDate: string;
  holdings: Holding[];
  totalValue: number;
  totalPositions: number;
}

export interface FundInfo {
  cik: string;
  name: string;
  manager: string;
  description: string;
}

// Fund CIK numbers
export const FUNDS: Record<string, FundInfo> = {
  duquesne: {
    cik: '0001536411',
    name: 'Duquesne Family Office LLC',
    manager: 'Stanley Druckenmiller',
    description: 'Legendary macro investor known for managing George Soros\'s Quantum Fund'
  },
  tudor: {
    cik: '0001067983',
    name: 'Tudor Investment Corp',
    manager: 'Paul Tudor Jones',
    description: 'Pioneering hedge fund manager and founder of Tudor Investment Corporation'
  }
};

const SEC_BASE_URL = 'https://data.sec.gov';
const SEC_SUBMISSIONS_URL = `${SEC_BASE_URL}/submissions`;
const SEC_ARCHIVES_URL = `${SEC_BASE_URL}/Archives/edgar/data`;

// Required headers for SEC API
const SEC_HEADERS = {
  'User-Agent': '13F-Dashboard research@example.com',
  'Accept': 'application/json',
};

export async function getFilingsList(cik: string): Promise<any> {
  const cleanCik = cik.replace(/^0+/, '');
  const paddedCik = cik.padStart(10, '0');
  
  const response = await fetch(
    `${SEC_SUBMISSIONS_URL}/CIK${paddedCik}.json`,
    { headers: SEC_HEADERS, next: { revalidate: 3600 } }
  );
  
  if (!response.ok) {
    throw new Error(`Failed to fetch filings: ${response.status}`);
  }
  
  return response.json();
}

export async function get13FFilings(cik: string, limit: number = 5): Promise<any[]> {
  const data = await getFilingsList(cik);
  const filings = data.filings?.recent;
  
  if (!filings) return [];
  
  const filings13F: any[] = [];
  
  for (let i = 0; i < filings.form.length && filings13F.length < limit; i++) {
    if (filings.form[i] === '13F-HR' || filings.form[i] === '13F-HR/A') {
      filings13F.push({
        accessionNumber: filings.accessionNumber[i],
        filedAt: filings.filingDate[i],
        reportDate: filings.reportDate[i],
        form: filings.form[i],
        primaryDocument: filings.primaryDocument[i],
      });
    }
  }
  
  return filings13F;
}

export async function parse13FHoldings(cik: string, accessionNumber: string): Promise<Holding[]> {
  const cleanCik = cik.replace(/^0+/, '');
  const cleanAccession = accessionNumber.replace(/-/g, '');
  
  // Try to get the infotable.xml file
  const indexUrl = `${SEC_ARCHIVES_URL}/${cleanCik}/${cleanAccession}/index.json`;
  
  try {
    const indexResponse = await fetch(indexUrl, { 
      headers: SEC_HEADERS,
      next: { revalidate: 3600 }
    });
    
    if (!indexResponse.ok) {
      console.error('Failed to fetch index:', indexResponse.status);
      return [];
    }
    
    const indexData = await indexResponse.json();
    const files = indexData.directory?.item || [];
    
    // Find the infotable XML file
    const infoTableFile = files.find((f: any) => 
      f.name.toLowerCase().includes('infotable') && 
      f.name.toLowerCase().endsWith('.xml')
    );
    
    if (!infoTableFile) {
      console.error('No infotable file found');
      return [];
    }
    
    const xmlUrl = `${SEC_ARCHIVES_URL}/${cleanCik}/${cleanAccession}/${infoTableFile.name}`;
    const xmlResponse = await fetch(xmlUrl, { 
      headers: SEC_HEADERS,
      next: { revalidate: 3600 }
    });
    
    if (!xmlResponse.ok) {
      console.error('Failed to fetch XML:', xmlResponse.status);
      return [];
    }
    
    const xmlText = await xmlResponse.text();
    return parseInfoTableXML(xmlText);
    
  } catch (error) {
    console.error('Error parsing 13F holdings:', error);
    return [];
  }
}

function parseInfoTableXML(xml: string): Holding[] {
  const holdings: Holding[] = [];
  
  // Simple XML parsing for infoTable entries
  const entryRegex = /<infoTable>([\s\S]*?)<\/infoTable>/gi;
  let match;
  
  while ((match = entryRegex.exec(xml)) !== null) {
    const entry = match[1];
    
    const getValue = (tag: string): string => {
      const tagRegex = new RegExp(`<(?:ns1:)?${tag}>([^<]*)<\/(?:ns1:)?${tag}>`, 'i');
      const m = entry.match(tagRegex);
      return m ? m[1].trim() : '';
    };
    
    const getNumValue = (tag: string): number => {
      const val = getValue(tag);
      return parseInt(val.replace(/,/g, ''), 10) || 0;
    };
    
    holdings.push({
      nameOfIssuer: getValue('nameOfIssuer'),
      titleOfClass: getValue('titleOfClass'),
      cusip: getValue('cusip'),
      value: getNumValue('value'),
      shares: getNumValue('sshPrnamt'),
      shrsOrPrnAmt: getValue('sshPrnamtType'),
      investmentDiscretion: getValue('investmentDiscretion'),
      votingAuthority: {
        sole: getNumValue('Sole'),
        shared: getNumValue('Shared'),
        none: getNumValue('None'),
      },
    });
  }
  
  // Sort by value descending
  return holdings.sort((a, b) => b.value - a.value);
}

export function formatCurrency(value: number): string {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(2)}B`;
  } else if (value >= 1000) {
    return `$${(value / 1000).toFixed(2)}M`;
  }
  return `$${value.toFixed(2)}K`;
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num);
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function getQuarter(dateStr: string): string {
  const date = new Date(dateStr);
  const quarter = Math.floor(date.getMonth() / 3) + 1;
  return `Q${quarter} ${date.getFullYear()}`;
}
