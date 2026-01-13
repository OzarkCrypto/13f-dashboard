'use client';

import { useState, useEffect } from 'react';
import { FUNDS, formatCurrency, formatNumber, formatDate, getQuarter, FundInfo, Holding } from '@/lib/sec-api';

interface Filing {
  accessionNumber: string;
  filedAt: string;
  reportDate: string;
  form: string;
  holdings: Holding[];
  totalValue: number;
  totalPositions: number;
}

interface FilingsData {
  fund: FundInfo;
  filings: Filing[];
}

export default function Dashboard() {
  const [activeFund, setActiveFund] = useState<'duquesne' | 'tudor'>('duquesne');
  const [data, setData] = useState<FilingsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedFiling, setSelectedFiling] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setLoading(true);
    setData(null);
    
    fetch(`/api/filings?fund=${activeFund}&limit=4`)
      .then(res => res.json())
      .then(data => {
        setData(data);
        setSelectedFiling(0);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error:', err);
        setLoading(false);
      });
  }, [activeFund]);

  const currentFiling = data?.filings?.[selectedFiling];
  const previousFiling = data?.filings?.[selectedFiling + 1];
  
  // Calculate changes between filings
  const getHoldingChange = (holding: Holding): { type: 'new' | 'increased' | 'decreased' | 'unchanged' | 'exited', prevShares?: number } => {
    if (!previousFiling) return { type: 'unchanged' };
    
    const prevHolding = previousFiling.holdings.find(h => h.cusip === holding.cusip);
    if (!prevHolding) return { type: 'new' };
    
    if (holding.shares > prevHolding.shares) return { type: 'increased', prevShares: prevHolding.shares };
    if (holding.shares < prevHolding.shares) return { type: 'decreased', prevShares: prevHolding.shares };
    return { type: 'unchanged', prevShares: prevHolding.shares };
  };
  
  // Filter holdings
  const filteredHoldings = currentFiling?.holdings.filter(h => 
    h.nameOfIssuer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    h.cusip.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  // Calculate portfolio stats
  const top10Value = filteredHoldings.slice(0, 10).reduce((sum, h) => sum + h.value, 0);
  const top10Percentage = currentFiling ? (top10Value / currentFiling.totalValue * 100) : 0;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-slate/50 backdrop-blur-sm sticky top-0 z-50 bg-midnight/80">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gold to-gold-light flex items-center justify-center">
                <span className="font-display font-bold text-midnight text-lg">13F</span>
              </div>
              <div>
                <h1 className="font-display text-xl font-semibold text-cream">
                  Hedge Fund Holdings
                </h1>
                <p className="text-xs text-silver">SEC 13F Filings Tracker</p>
              </div>
            </div>
            
            {/* Fund Selector */}
            <div className="flex gap-2">
              {Object.entries(FUNDS).map(([key, fund]) => (
                <button
                  key={key}
                  onClick={() => setActiveFund(key as 'duquesne' | 'tudor')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    activeFund === key
                      ? 'bg-gold text-midnight'
                      : 'bg-graphite text-silver hover:text-cream hover:bg-slate'
                  }`}
                >
                  {fund.manager.split(' ')[1]}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Fund Info Card */}
        <div className="mb-8 animate-fade-in">
          <div className="bg-gradient-to-br from-graphite to-charcoal rounded-2xl p-6 border border-slate/30 card-hover">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gold text-sm font-mono mb-1">
                  CIK: {FUNDS[activeFund].cik}
                </p>
                <h2 className="font-display text-3xl font-semibold gradient-text mb-2">
                  {FUNDS[activeFund].manager}
                </h2>
                <p className="text-silver max-w-xl">
                  {FUNDS[activeFund].description}
                </p>
                <p className="text-sm text-slate mt-2">
                  {FUNDS[activeFund].name}
                </p>
              </div>
              
              {/* Stats */}
              {currentFiling && (
                <div className="text-right">
                  <p className="text-4xl font-display font-bold text-cream tabular-nums">
                    {formatCurrency(currentFiling.totalValue)}
                  </p>
                  <p className="text-silver text-sm">
                    Portfolio Value ({getQuarter(currentFiling.reportDate)})
                  </p>
                  <p className="text-gold text-sm mt-1">
                    {currentFiling.totalPositions} positions
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Filing Selector */}
        {data?.filings && data.filings.length > 0 && (
          <div className="mb-6 animate-fade-in stagger-1">
            <div className="flex gap-3 overflow-x-auto pb-2">
              {data.filings.map((filing, idx) => (
                <button
                  key={filing.accessionNumber}
                  onClick={() => setSelectedFiling(idx)}
                  className={`flex-shrink-0 px-4 py-3 rounded-xl border transition-all duration-300 ${
                    selectedFiling === idx
                      ? 'bg-graphite border-gold/50 text-cream'
                      : 'bg-charcoal border-slate/30 text-silver hover:border-slate hover:text-cream'
                  }`}
                >
                  <p className="font-mono text-sm font-medium">
                    {getQuarter(filing.reportDate)}
                  </p>
                  <p className="text-xs opacity-70 mt-1">
                    Filed: {formatDate(filing.filedAt)}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Stats Grid */}
        {currentFiling && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 animate-fade-in stagger-2">
            <StatCard
              label="Total Value"
              value={formatCurrency(currentFiling.totalValue)}
              subtext="13F reported"
            />
            <StatCard
              label="Positions"
              value={currentFiling.totalPositions.toString()}
              subtext="unique holdings"
            />
            <StatCard
              label="Top 10 Concentration"
              value={`${top10Percentage.toFixed(1)}%`}
              subtext={formatCurrency(top10Value)}
            />
            <StatCard
              label="Avg Position Size"
              value={formatCurrency(currentFiling.totalValue / currentFiling.totalPositions)}
              subtext="per holding"
            />
          </div>
        )}

        {/* Search */}
        <div className="mb-6 animate-fade-in stagger-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search holdings by name or CUSIP..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-graphite border border-slate/30 rounded-xl px-4 py-3 pl-11 text-cream placeholder-silver focus:outline-none focus:border-gold/50 transition-colors"
            />
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-silver"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* Holdings Table */}
        <div className="bg-charcoal rounded-2xl border border-slate/30 overflow-hidden animate-fade-in stagger-4">
          {loading ? (
            <div className="p-8">
              <div className="space-y-4">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="shimmer h-12 rounded-lg" />
                ))}
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="holdings-table w-full">
                <thead>
                  <tr className="border-b border-slate/30">
                    <th className="text-left py-4 px-6 text-xs font-mono uppercase tracking-wider text-silver">#</th>
                    <th className="text-left py-4 px-6 text-xs font-mono uppercase tracking-wider text-silver">Company</th>
                    <th className="text-left py-4 px-6 text-xs font-mono uppercase tracking-wider text-silver">Class</th>
                    <th className="text-right py-4 px-6 text-xs font-mono uppercase tracking-wider text-silver">Value</th>
                    <th className="text-right py-4 px-6 text-xs font-mono uppercase tracking-wider text-silver">Shares</th>
                    <th className="text-right py-4 px-6 text-xs font-mono uppercase tracking-wider text-silver">% of Portfolio</th>
                    <th className="text-center py-4 px-6 text-xs font-mono uppercase tracking-wider text-silver">Change</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredHoldings.map((holding, idx) => {
                    const change = getHoldingChange(holding);
                    const portfolioPercent = currentFiling ? (holding.value / currentFiling.totalValue * 100) : 0;
                    
                    return (
                      <tr
                        key={`${holding.cusip}-${idx}`}
                        className="border-b border-slate/10 hover:bg-gold/5 transition-colors"
                      >
                        <td className="py-4 px-6 text-silver text-sm tabular-nums">
                          {idx + 1}
                        </td>
                        <td className="py-4 px-6">
                          <p className="text-cream font-medium">{holding.nameOfIssuer}</p>
                          <p className="text-silver text-xs font-mono">{holding.cusip}</p>
                        </td>
                        <td className="py-4 px-6 text-silver text-sm">
                          {holding.titleOfClass}
                        </td>
                        <td className="py-4 px-6 text-right">
                          <p className="text-cream font-mono tabular-nums">
                            {formatCurrency(holding.value)}
                          </p>
                        </td>
                        <td className="py-4 px-6 text-right text-silver font-mono tabular-nums text-sm">
                          {formatNumber(holding.shares)}
                        </td>
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <div className="w-16 h-1.5 bg-slate/30 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gold rounded-full"
                                style={{ width: `${Math.min(portfolioPercent * 2, 100)}%` }}
                              />
                            </div>
                            <span className="text-cream font-mono tabular-nums text-sm w-16 text-right">
                              {portfolioPercent.toFixed(2)}%
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <ChangeIndicator change={change} holding={holding} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              
              {filteredHoldings.length === 0 && (
                <div className="p-8 text-center text-silver">
                  No holdings found matching "{searchTerm}"
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-silver text-sm">
          <p>
            Data sourced from SEC EDGAR. 13F filings are reported quarterly with a 45-day delay.
          </p>
          <p className="mt-1 text-slate">
            This is for informational purposes only. Not financial advice.
          </p>
        </footer>
      </main>
    </div>
  );
}

function StatCard({ label, value, subtext }: { label: string; value: string; subtext: string }) {
  return (
    <div className="bg-graphite rounded-xl p-4 border border-slate/30 card-hover">
      <p className="text-silver text-xs font-mono uppercase tracking-wider mb-2">{label}</p>
      <p className="text-2xl font-display font-semibold text-cream tabular-nums">{value}</p>
      <p className="text-slate text-xs mt-1">{subtext}</p>
    </div>
  );
}

function ChangeIndicator({ change, holding }: { change: { type: string; prevShares?: number }; holding: Holding }) {
  const changePercent = change.prevShares 
    ? ((holding.shares - change.prevShares) / change.prevShares * 100)
    : 0;

  switch (change.type) {
    case 'new':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-emerald/10 text-emerald text-xs font-medium">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
          </svg>
          NEW
        </span>
      );
    case 'increased':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-emerald/10 text-emerald text-xs font-mono tabular-nums">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
          +{changePercent.toFixed(1)}%
        </span>
      );
    case 'decreased':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-ruby/10 text-ruby text-xs font-mono tabular-nums">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          {changePercent.toFixed(1)}%
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full bg-slate/30 text-silver text-xs">
          —
        </span>
      );
  }
}
