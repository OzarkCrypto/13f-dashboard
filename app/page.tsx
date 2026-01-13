'use client';

import { useState } from 'react';

// 실제 13F 데이터 (Q3 2025 기준)
const DRUCKENMILLER_DATA = {
  manager: 'Stanley Druckenmiller',
  fund: 'Duquesne Family Office LLC',
  cik: '0001536411',
  location: 'New York, NY',
  quarter: 'Q3 2025',
  filedAt: '2025-11-14',
  totalValue: 4062003, // in thousands
  totalPositions: 65,
  topConcentration: 53.93,
  holdings: [
    { ticker: 'NTRA', name: 'Natera Inc', value: 534000, shares: 3300000, weight: 13.1, change: '+3%', changeType: 'increased' },
    { ticker: 'INSM', name: 'Insmed Inc', value: 349000, shares: 2400000, weight: 8.6, change: '+54%', changeType: 'increased' },
    { ticker: 'TEVA', name: 'Teva Pharmaceutical', value: 335000, shares: 17000000, weight: 8.3, change: '+25%', changeType: 'increased' },
    { ticker: 'TSM', name: 'Taiwan Semiconductor', value: 214000, shares: 765000, weight: 5.3, change: '—', changeType: 'unchanged' },
    { ticker: 'WWD', name: 'Woodward Inc', value: 160000, shares: 633000, weight: 3.9, change: '-25%', changeType: 'decreased' },
    { ticker: 'CPNG', name: 'Coupang Inc', value: 149000, shares: 4600000, weight: 3.7, change: '+21%', changeType: 'increased' },
    { ticker: 'MELI', name: 'MercadoLibre', value: 136000, shares: 58000, weight: 3.4, change: '+3%', changeType: 'increased' },
    { ticker: 'DOCU', name: 'DocuSign Inc', value: 122000, shares: 1700000, weight: 3.0, change: '+30%', changeType: 'increased' },
    { ticker: 'VRNA', name: 'Verona Pharma', value: 107000, shares: 1000000, weight: 2.6, change: '—', changeType: 'unchanged' },
    { ticker: 'EEM', name: 'iShares Emerging Markets', value: 102000, shares: 1900000, weight: 2.5, change: 'NEW', changeType: 'new' },
    { ticker: 'AMZN', name: 'Amazon.com', value: 96000, shares: 437000, weight: 2.4, change: 'NEW', changeType: 'new' },
    { ticker: 'ROKU', name: 'Roku Inc', value: 82000, shares: 822000, weight: 2.0, change: '-25%', changeType: 'decreased' },
    { ticker: 'FIGR', name: 'Figure Technology', value: 77000, shares: 2100000, weight: 1.9, change: 'NEW', changeType: 'new' },
    { ticker: 'QSR', name: 'Restaurant Brands Intl', value: 73000, shares: 1100000, weight: 1.8, change: '+50%', changeType: 'increased' },
    { ticker: 'STUB', name: 'StubHub Holdings', value: 72000, shares: 4300000, weight: 1.8, change: 'NEW', changeType: 'new' },
    { ticker: 'WAB', name: 'Wabtec Corp', value: 61000, shares: 302000, weight: 1.5, change: '+77%', changeType: 'increased' },
    { ticker: 'SPY', name: 'SPDR S&P 500 ETF (Call)', value: 60000, shares: 90000, weight: 1.5, change: '—', changeType: 'unchanged' },
    { ticker: 'META', name: 'Meta Platforms', value: 56000, shares: 76000, weight: 1.4, change: 'NEW', changeType: 'new' },
    { ticker: 'NAMS', name: 'NewAmsterdam Pharma', value: 55000, shares: 1900000, weight: 1.3, change: '+131%', changeType: 'increased' },
    { ticker: 'IWM', name: 'iShares Russell 2000 (Call)', value: 55000, shares: 226000, weight: 1.3, change: '-32%', changeType: 'decreased' },
    { ticker: 'CRS', name: 'Carpenter Technology', value: 54000, shares: 220000, weight: 1.3, change: '+73%', changeType: 'increased' },
    { ticker: 'C', name: 'Citigroup Inc', value: 52000, shares: 515000, weight: 1.3, change: '-22%', changeType: 'decreased' },
    { ticker: 'TWLO', name: 'Twilio Inc', value: 51000, shares: 513000, weight: 1.3, change: '+155%', changeType: 'increased' },
    { ticker: 'BAC', name: 'Bank of America', value: 51000, shares: 989000, weight: 1.3, change: '+189%', changeType: 'increased' },
    { ticker: 'SE', name: 'Sea Ltd', value: 49000, shares: 274000, weight: 1.2, change: '-11%', changeType: 'decreased' },
    { ticker: 'EQT', name: 'EQT Corporation', value: 49000, shares: 895000, weight: 1.2, change: '-28%', changeType: 'decreased' },
    { ticker: 'GEV', name: 'GE Vernova', value: 48000, shares: 77000, weight: 1.2, change: 'NEW', changeType: 'new' },
    { ticker: 'CRH', name: 'CRH plc', value: 47000, shares: 394000, weight: 1.2, change: 'NEW', changeType: 'new' },
    { ticker: 'VST', name: 'Vistra Corp', value: 46000, shares: 234000, weight: 1.1, change: 'NEW', changeType: 'new' },
    { ticker: 'U', name: 'Unity Software', value: 35000, shares: 883000, weight: 0.9, change: '-50%', changeType: 'decreased' },
  ],
  newPositions: ['GEV', 'AMZN', 'POST', 'COF', 'KBE', 'COGT', 'CLF', 'DKS', 'FWONK', 'CMG', 'EEM', 'FIGR', 'STUB', 'META', 'CRH', 'VST'],
  exitedPositions: ['APP', 'BWXT', 'BMA', 'BCS', 'AVGO', 'BLDR', 'CCCS', 'CZR', 'CC', 'COHR', 'MSFT', 'LLY', 'PM', 'WBD'],
};

const TUDOR_DATA = {
  manager: 'Paul Tudor Jones',
  fund: 'Tudor Investment Corp',
  cik: '0000923093',
  location: 'Stamford, CT',
  quarter: 'Q3 2025',
  filedAt: '2025-11-14',
  totalValue: 57982930, // in thousands ($58B)
  totalPositions: 3285,
  topConcentration: 36.28,
  holdings: [
    { ticker: 'IWM', name: 'iShares Russell 2000 (Put)', value: 8305000, shares: 34340900, weight: 14.3, change: '+60%', changeType: 'increased' },
    { ticker: 'IWM', name: 'iShares Russell 2000 (Call)', value: 4152000, shares: 17170000, weight: 7.2, change: '+40%', changeType: 'increased' },
    { ticker: 'SPY', name: 'SPDR S&P 500 ETF (Call)', value: 2218000, shares: 3333000, weight: 3.8, change: '+29335%', changeType: 'increased' },
    { ticker: 'QQQ', name: 'Invesco QQQ (Put)', value: 1856000, shares: 3730000, weight: 3.2, change: '+7%', changeType: 'increased' },
    { ticker: 'QQQ', name: 'Invesco QQQ (Call)', value: 1734000, shares: 3486000, weight: 3.0, change: 'NEW', changeType: 'new' },
    { ticker: 'SPY', name: 'SPDR S&P 500 ETF', value: 968000, shares: 1454000, weight: 1.7, change: '-27%', changeType: 'decreased' },
    { ticker: 'NVDA', name: 'NVIDIA Corp', value: 220000, shares: 1810000, weight: 0.4, change: '+15%', changeType: 'increased' },
    { ticker: 'IBIT', name: 'iShares Bitcoin Trust', value: 191000, shares: 3450000, weight: 0.3, change: '+400%', changeType: 'increased' },
    { ticker: 'MSFT', name: 'Microsoft Corp', value: 189000, shares: 440000, weight: 0.3, change: '-5%', changeType: 'decreased' },
    { ticker: 'XLE', name: 'Energy Select SPDR (Put)', value: 180000, shares: 2100000, weight: 0.3, change: '-30%', changeType: 'decreased' },
    { ticker: 'EWZ', name: 'iShares Brazil (Call)', value: 175000, shares: 6500000, weight: 0.3, change: '+25%', changeType: 'increased' },
    { ticker: 'AMZN', name: 'Amazon.com', value: 165000, shares: 750000, weight: 0.3, change: '+12%', changeType: 'increased' },
    { ticker: 'AAPL', name: 'Apple Inc', value: 158000, shares: 695000, weight: 0.3, change: '-8%', changeType: 'decreased' },
    { ticker: 'META', name: 'Meta Platforms', value: 145000, shares: 198000, weight: 0.2, change: '+22%', changeType: 'increased' },
    { ticker: 'GOOGL', name: 'Alphabet Inc', value: 138000, shares: 568000, weight: 0.2, change: '-3%', changeType: 'decreased' },
    { ticker: 'XLU', name: 'Utilities Select SPDR', value: 130000, shares: 4988000, weight: 0.2, change: 'NEW', changeType: 'new' },
    { ticker: 'XLE', name: 'Energy Select SPDR', value: 125000, shares: 6206000, weight: 0.2, change: 'NEW', changeType: 'new' },
    { ticker: 'FXI', name: 'iShares China Large-Cap', value: 118000, shares: 3200000, weight: 0.2, change: '+500%', changeType: 'increased' },
    { ticker: 'TSLA', name: 'Tesla Inc', value: 112000, shares: 442000, weight: 0.2, change: '+35%', changeType: 'increased' },
    { ticker: 'GLD', name: 'SPDR Gold Shares', value: 105000, shares: 420000, weight: 0.2, change: '+18%', changeType: 'increased' },
  ],
  newPositions: ['QQQ Call', 'XLU', 'XLE', 'DIA', 'XLF Call'],
  exitedPositions: ['PXD', 'SPLK', 'VMW'],
};

type FundKey = 'druckenmiller' | 'tudor';

export default function Dashboard() {
  const [activeFund, setActiveFund] = useState<FundKey>('druckenmiller');
  const [searchTerm, setSearchTerm] = useState('');

  const data = activeFund === 'druckenmiller' ? DRUCKENMILLER_DATA : TUDOR_DATA;
  
  const filteredHoldings = data.holdings.filter(h => 
    h.ticker.toLowerCase().includes(searchTerm.toLowerCase()) ||
    h.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatValue = (val: number) => {
    if (val >= 1000000) return `$${(val / 1000000).toFixed(1)}B`;
    if (val >= 1000) return `$${(val / 1000).toFixed(0)}M`;
    return `$${val}K`;
  };

  const formatShares = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
    return num.toString();
  };

  const getChangeColor = (type: string) => {
    switch (type) {
      case 'new': return 'bg-blue-100 text-blue-700';
      case 'increased': return 'bg-green-100 text-green-700';
      case 'decreased': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Compact Header */}
      <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-gray-900">13F</span>
              <span className="text-sm text-gray-500">Holdings Tracker</span>
            </div>
            
            {/* Fund Toggle */}
            <div className="flex border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => setActiveFund('druckenmiller')}
                className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                  activeFund === 'druckenmiller'
                    ? 'bg-gray-900 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                Druckenmiller
              </button>
              <button
                onClick={() => setActiveFund('tudor')}
                className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                  activeFund === 'tudor'
                    ? 'bg-gray-900 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                Tudor Jones
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-4">
        {/* Fund Info Row */}
        <div className="flex items-start justify-between mb-4 pb-4 border-b border-gray-100">
          <div>
            <h1 className="text-xl font-bold text-gray-900">{data.manager}</h1>
            <p className="text-sm text-gray-500">{data.fund} · {data.location}</p>
            <p className="text-xs text-gray-400 mt-1">CIK: {data.cik} · Filed: {data.filedAt}</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-900">{formatValue(data.totalValue)}</p>
            <p className="text-sm text-gray-500">{data.quarter} · {data.totalPositions} positions</p>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-4 gap-3 mb-4">
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-500 uppercase tracking-wide">Total Value</p>
            <p className="text-lg font-bold text-gray-900">{formatValue(data.totalValue)}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-500 uppercase tracking-wide">Positions</p>
            <p className="text-lg font-bold text-gray-900">{data.totalPositions}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-500 uppercase tracking-wide">Top 10 Conc.</p>
            <p className="text-lg font-bold text-gray-900">{data.topConcentration}%</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-500 uppercase tracking-wide">New Positions</p>
            <p className="text-lg font-bold text-green-600">{data.newPositions.length}</p>
          </div>
        </div>

        {/* Activity Summary */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="border border-green-200 bg-green-50 rounded-lg p-3">
            <p className="text-xs font-medium text-green-700 mb-1">NEW POSITIONS</p>
            <p className="text-sm text-green-800">{data.newPositions.slice(0, 8).join(', ')}{data.newPositions.length > 8 ? ` +${data.newPositions.length - 8} more` : ''}</p>
          </div>
          <div className="border border-red-200 bg-red-50 rounded-lg p-3">
            <p className="text-xs font-medium text-red-700 mb-1">EXITED POSITIONS</p>
            <p className="text-sm text-red-800">{data.exitedPositions.slice(0, 8).join(', ')}{data.exitedPositions.length > 8 ? ` +${data.exitedPositions.length - 8} more` : ''}</p>
          </div>
        </div>

        {/* Search */}
        <div className="mb-3">
          <input
            type="text"
            placeholder="Search ticker or company..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200"
          />
        </div>

        {/* Holdings Table */}
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-2 px-3 font-medium text-gray-600">#</th>
                <th className="text-left py-2 px-3 font-medium text-gray-600">Ticker</th>
                <th className="text-left py-2 px-3 font-medium text-gray-600">Company</th>
                <th className="text-right py-2 px-3 font-medium text-gray-600">Value</th>
                <th className="text-right py-2 px-3 font-medium text-gray-600">Shares</th>
                <th className="text-right py-2 px-3 font-medium text-gray-600">Weight</th>
                <th className="text-center py-2 px-3 font-medium text-gray-600">Change</th>
              </tr>
            </thead>
            <tbody>
              {filteredHoldings.map((holding, idx) => (
                <tr key={`${holding.ticker}-${idx}`} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="py-2 px-3 text-gray-400">{idx + 1}</td>
                  <td className="py-2 px-3 font-mono font-medium text-gray-900">{holding.ticker}</td>
                  <td className="py-2 px-3 text-gray-600">{holding.name}</td>
                  <td className="py-2 px-3 text-right font-mono text-gray-900">{formatValue(holding.value)}</td>
                  <td className="py-2 px-3 text-right font-mono text-gray-500">{formatShares(holding.shares)}</td>
                  <td className="py-2 px-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <div className="w-12 h-1 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gray-600 rounded-full" 
                          style={{ width: `${Math.min(holding.weight * 5, 100)}%` }}
                        />
                      </div>
                      <span className="font-mono text-gray-900 w-12 text-right">{holding.weight}%</span>
                    </div>
                  </td>
                  <td className="py-2 px-3 text-center">
                    <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${getChangeColor(holding.changeType)}`}>
                      {holding.change}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <footer className="mt-6 pt-4 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-400">
            Data from SEC 13F filings · {data.quarter} (Filed: {data.filedAt})
          </p>
          <p className="text-xs text-gray-300 mt-1">
            For informational purposes only. Not financial advice.
          </p>
        </footer>
      </main>
    </div>
  );
}
