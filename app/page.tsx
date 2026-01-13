'use client';

import { useState, useMemo } from 'react';

// 주식 설명 데이터 (확장)
const STOCK_INFO: Record<string, { desc: string; marketCap: string }> = {
  // Mega Cap Tech
  'AAPL': { desc: 'Consumer tech, iPhone maker', marketCap: '$3.5T' },
  'MSFT': { desc: 'Software & cloud (Azure)', marketCap: '$3.1T' },
  'NVDA': { desc: 'AI chips leader, GPUs', marketCap: '$3.4T' },
  'GOOGL': { desc: 'Search & ads monopoly', marketCap: '$2.1T' },
  'GOOG': { desc: 'Alphabet Class C shares', marketCap: '$2.1T' },
  'AMZN': { desc: 'E-commerce & AWS cloud', marketCap: '$2.3T' },
  'META': { desc: 'Social media & ads', marketCap: '$1.5T' },
  'TSLA': { desc: 'EVs & energy storage', marketCap: '$1.3T' },
  'TSM': { desc: 'Semiconductor foundry #1', marketCap: '$900B' },
  'AVGO': { desc: 'Broadcom, AI networking', marketCap: '$800B' },
  
  // China Tech
  'BABA': { desc: 'China e-commerce titan', marketCap: '$230B' },
  'PDD': { desc: 'Temu parent, discount e-com', marketCap: '$150B' },
  'JD': { desc: 'China e-commerce #2', marketCap: '$50B' },
  'KWEB': { desc: 'China Internet ETF', marketCap: 'ETF' },
  
  // Financials
  'BAC': { desc: 'Bank of America', marketCap: '$350B' },
  'C': { desc: 'Citigroup global bank', marketCap: '$130B' },
  'COF': { desc: 'Capital One, credit cards', marketCap: '$70B' },
  'SYF': { desc: 'Synchrony consumer finance', marketCap: '$22B' },
  'EWBC': { desc: 'East West Bank, US-Asia', marketCap: '$13B' },
  'V': { desc: 'Visa payments network', marketCap: '$580B' },
  'BRK.B': { desc: 'Berkshire Hathaway B', marketCap: '$1T' },
  'KBE': { desc: 'SPDR Bank ETF', marketCap: 'ETF' },
  
  // Healthcare / Biotech
  'NTRA': { desc: 'Natera genetic testing', marketCap: '$21B' },
  'INSM': { desc: 'Insmed rare disease', marketCap: '$13B' },
  'TEVA': { desc: 'Generic pharma leader', marketCap: '$19B' },
  'VRNA': { desc: 'Verona respiratory biotech', marketCap: '$6B' },
  'NAMS': { desc: 'NewAmsterdam cholesterol', marketCap: '$2B' },
  'MOH': { desc: 'Molina Medicaid managed care', marketCap: '$20B' },
  'LULU': { desc: 'Lululemon athletic apparel', marketCap: '$38B' },
  'ELVN': { desc: 'Enliven cancer biotech', marketCap: '$1B' },
  'COGT': { desc: 'Cogent cancer biotech', marketCap: '$1B' },
  'PTGX': { desc: 'Protagonist GI biotech', marketCap: '$2B' },
  'UNH': { desc: 'UnitedHealth insurance', marketCap: '$450B' },
  'PFE': { desc: 'Pfizer big pharma', marketCap: '$140B' },
  'REGN': { desc: 'Regeneron biotech', marketCap: '$90B' },
  'EL': { desc: 'Estee Lauder cosmetics', marketCap: '$25B' },
  
  // Industrial / Aerospace
  'WWD': { desc: 'Woodward aerospace parts', marketCap: '$9B' },
  'WAB': { desc: 'Wabtec rail equipment', marketCap: '$27B' },
  'CRS': { desc: 'Carpenter specialty metals', marketCap: '$9B' },
  'GEV': { desc: 'GE Vernova power spin-off', marketCap: '$95B' },
  'CRH': { desc: 'CRH building materials', marketCap: '$65B' },
  
  // Consumer
  'CPNG': { desc: 'Coupang Korea e-commerce', marketCap: '$58B' },
  'MELI': { desc: 'MercadoLibre LatAm e-com', marketCap: '$105B' },
  'QSR': { desc: 'Restaurant Brands (BK, Tim)', marketCap: '$30B' },
  'CMG': { desc: 'Chipotle fast casual', marketCap: '$75B' },
  'DKS': { desc: "Dick's Sporting Goods", marketCap: '$18B' },
  'TXRH': { desc: 'Texas Roadhouse steaks', marketCap: '$12B' },
  'WHR': { desc: 'Whirlpool appliances', marketCap: '$5B' },
  'POST': { desc: 'Post Holdings cereals', marketCap: '$7B' },
  'TBBB': { desc: 'BBB Foods Mexico grocery', marketCap: '$3B' },
  
  // Tech / Software
  'DOCU': { desc: 'DocuSign e-signatures', marketCap: '$17B' },
  'TWLO': { desc: 'Twilio cloud comms', marketCap: '$12B' },
  'ROKU': { desc: 'Roku streaming platform', marketCap: '$10B' },
  'U': { desc: 'Unity game engine', marketCap: '$8B' },
  'SE': { desc: 'Sea Ltd gaming/e-com', marketCap: '$35B' },
  'MDB': { desc: 'MongoDB database', marketCap: '$25B' },
  'ARM': { desc: 'ARM chip architecture', marketCap: '$150B' },
  'SMTC': { desc: 'Semtech semiconductors', marketCap: '$5B' },
  'PLTR': { desc: 'Palantir AI analytics', marketCap: '$180B' },
  'AMD': { desc: 'AMD CPUs & GPUs', marketCap: '$200B' },
  'QCOM': { desc: 'Qualcomm mobile chips', marketCap: '$180B' },
  
  // Energy
  'EQT': { desc: 'EQT natural gas producer', marketCap: '$20B' },
  'OXY': { desc: 'Occidental oil & gas', marketCap: '$42B' },
  'HAL': { desc: 'Halliburton oilfield svcs', marketCap: '$25B' },
  'CLF': { desc: 'Cleveland-Cliffs steel', marketCap: '$5B' },
  'VST': { desc: 'Vistra power generation', marketCap: '$45B' },
  'PCG': { desc: 'PG&E California utility', marketCap: '$50B' },
  'SEI': { desc: 'Solaris energy infra', marketCap: '$2B' },
  
  // ETFs
  'SPY': { desc: 'S&P 500 ETF', marketCap: 'ETF' },
  'QQQ': { desc: 'Nasdaq 100 ETF', marketCap: 'ETF' },
  'IWM': { desc: 'Russell 2000 small cap', marketCap: 'ETF' },
  'EEM': { desc: 'Emerging markets ETF', marketCap: 'ETF' },
  'RSP': { desc: 'Equal weight S&P 500', marketCap: 'ETF' },
  'IBIT': { desc: 'iShares Bitcoin ETF', marketCap: 'ETF' },
  'ARGT': { desc: 'Argentina ETF', marketCap: 'ETF' },
  
  // Media / Entertainment
  'FWONK': { desc: 'Liberty F1 racing', marketCap: '$20B' },
  'TKO': { desc: 'TKO WWE & UFC sports', marketCap: '$22B' },
  'SW': { desc: 'Smurfit WestRock packaging', marketCap: '$25B' },
  'GFL': { desc: 'GFL waste services', marketCap: '$18B' },
  'FLUT': { desc: 'Flutter betting (FanDuel)', marketCap: '$45B' },
  
  // Homebuilders
  'LEN': { desc: 'Lennar homebuilder', marketCap: '$35B' },
  'DHI': { desc: 'D.R. Horton homes', marketCap: '$45B' },
  
  // Misc
  'FIGR': { desc: 'Figure blockchain fintech', marketCap: '$3B' },
  'STUB': { desc: 'StubHub ticket platform', marketCap: '$3B' },
  'SLM': { desc: 'Sallie Mae student loans', marketCap: '$6B' },
  'AEVA': { desc: 'Aeva lidar sensors', marketCap: '$1B' },
  'PCT': { desc: 'PureCycle plastic recycling', marketCap: '$2B' },
  'DAKT': { desc: 'Daktronics LED displays', marketCap: '$700M' },
  'NU': { desc: 'Nubank digital bank Brazil', marketCap: '$60B' },
  'OPCH': { desc: 'Option Care infusion', marketCap: '$5B' },
  'GPC': { desc: 'Genuine Parts auto parts', marketCap: '$18B' },
  'SNDK': { desc: 'SanDisk storage', marketCap: '$20B' },
  'STX': { desc: 'Seagate hard drives', marketCap: '$20B' },
  'SATS': { desc: 'EchoStar satellite', marketCap: '$5B' },
  'YPF': { desc: 'YPF Argentina oil', marketCap: '$15B' },
  'CHYM': { desc: 'Chime fintech', marketCap: '$25B' },
  'FISV': { desc: 'Fiserv payments tech', marketCap: '$100B' },
};

const getStockInfo = (ticker: string) => STOCK_INFO[ticker] || { desc: '—', marketCap: '—' };

// Types
interface Holding {
  ticker: string;
  name: string;
  value: number;
  shares: number;
  weight: number;
  change: string;
  changeType: 'new' | 'increased' | 'decreased' | 'unchanged' | 'exit';
}

interface QuarterData {
  totalValue: number;
  totalPositions: number;
  holdings: Holding[];
  newPositions: string[];
  exitedPositions: string[];
}

interface InvestorData {
  id: string;
  name: string;
  fund: string;
  style: string;
  location: string;
  quarters: Record<string, QuarterData>;
}

// ============ INVESTOR DATA ============
const INVESTORS: InvestorData[] = [
  {
    id: 'druckenmiller',
    name: 'Stanley Druckenmiller',
    fund: 'Duquesne Family Office',
    style: 'Macro / Growth',
    location: 'New York, NY',
    quarters: {
      'Q3 2025': {
        totalValue: 4062003,
        totalPositions: 64,
        holdings: [
          { ticker: 'NTRA', name: 'Natera Inc', value: 534000, shares: 3214532, weight: 13.1, change: '+3%', changeType: 'increased' },
          { ticker: 'INSM', name: 'Insmed Inc', value: 349000, shares: 2423000, weight: 8.6, change: '+2%', changeType: 'increased' },
          { ticker: 'TEVA', name: 'Teva Pharma', value: 335000, shares: 16590000, weight: 8.3, change: '+3%', changeType: 'increased' },
          { ticker: 'TSM', name: 'Taiwan Semi', value: 214000, shares: 765000, weight: 5.3, change: '—', changeType: 'unchanged' },
          { ticker: 'WWD', name: 'Woodward', value: 160000, shares: 633000, weight: 3.9, change: '-25%', changeType: 'decreased' },
          { ticker: 'CPNG', name: 'Coupang', value: 149000, shares: 4626000, weight: 3.7, change: '+12%', changeType: 'increased' },
          { ticker: 'MELI', name: 'MercadoLibre', value: 136000, shares: 58200, weight: 3.4, change: '+8%', changeType: 'increased' },
          { ticker: 'DOCU', name: 'DocuSign', value: 122000, shares: 1692000, weight: 3.0, change: '+30%', changeType: 'increased' },
          { ticker: 'VRNA', name: 'Verona Pharma', value: 107000, shares: 1003000, weight: 2.6, change: '—', changeType: 'unchanged' },
          { ticker: 'EEM', name: 'iShares EM ETF', value: 102000, shares: 1910000, weight: 2.5, change: 'NEW', changeType: 'new' },
          { ticker: 'AMZN', name: 'Amazon', value: 96000, shares: 437000, weight: 2.4, change: 'NEW', changeType: 'new' },
          { ticker: 'ROKU', name: 'Roku', value: 82000, shares: 822000, weight: 2.0, change: '-25%', changeType: 'decreased' },
          { ticker: 'FIGR', name: 'Figure Technology', value: 77000, shares: 2118000, weight: 1.9, change: 'NEW', changeType: 'new' },
          { ticker: 'QSR', name: 'Restaurant Brands', value: 73000, shares: 1138000, weight: 1.8, change: '+50%', changeType: 'increased' },
          { ticker: 'STUB', name: 'StubHub', value: 72000, shares: 4277000, weight: 1.8, change: 'NEW', changeType: 'new' },
          { ticker: 'WAB', name: 'Wabtec', value: 61000, shares: 302000, weight: 1.5, change: '+77%', changeType: 'increased' },
          { ticker: 'SPY', name: 'S&P 500 Call', value: 60000, shares: 90000, weight: 1.5, change: '—', changeType: 'unchanged' },
          { ticker: 'META', name: 'Meta', value: 56000, shares: 76000, weight: 1.4, change: 'NEW', changeType: 'new' },
          { ticker: 'NAMS', name: 'NewAmsterdam', value: 55000, shares: 1934000, weight: 1.3, change: '+131%', changeType: 'increased' },
          { ticker: 'IWM', name: 'Russell 2000 Call', value: 55000, shares: 226000, weight: 1.3, change: '-32%', changeType: 'decreased' },
          { ticker: 'CRS', name: 'Carpenter Tech', value: 54000, shares: 220000, weight: 1.3, change: '+73%', changeType: 'increased' },
          { ticker: 'C', name: 'Citigroup', value: 52000, shares: 515000, weight: 1.3, change: '-22%', changeType: 'decreased' },
          { ticker: 'TWLO', name: 'Twilio', value: 51000, shares: 513000, weight: 1.3, change: '+155%', changeType: 'increased' },
          { ticker: 'BAC', name: 'Bank of America', value: 51000, shares: 989000, weight: 1.3, change: '+189%', changeType: 'increased' },
          { ticker: 'SE', name: 'Sea Ltd', value: 49000, shares: 274000, weight: 1.2, change: '-11%', changeType: 'decreased' },
          { ticker: 'EQT', name: 'EQT Corp', value: 49000, shares: 895000, weight: 1.2, change: '-28%', changeType: 'decreased' },
          { ticker: 'GEV', name: 'GE Vernova', value: 48000, shares: 77000, weight: 1.2, change: 'NEW', changeType: 'new' },
          { ticker: 'CRH', name: 'CRH plc', value: 47000, shares: 394000, weight: 1.2, change: 'NEW', changeType: 'new' },
          { ticker: 'VST', name: 'Vistra Energy', value: 46000, shares: 234000, weight: 1.1, change: 'NEW', changeType: 'new' },
          { ticker: 'U', name: 'Unity Software', value: 35000, shares: 883000, weight: 0.9, change: '-50%', changeType: 'decreased' },
          { ticker: 'LEN', name: 'Lennar', value: 35000, shares: 279000, weight: 0.9, change: '+210%', changeType: 'increased' },
          { ticker: 'DHI', name: 'D.R. Horton', value: 35000, shares: 205000, weight: 0.9, change: '+165%', changeType: 'increased' },
          { ticker: 'CLF', name: 'Cleveland-Cliffs', value: 33000, shares: 2705000, weight: 0.8, change: 'NEW', changeType: 'new' },
          { ticker: 'TBBB', name: 'BBB Foods', value: 32000, shares: 1187000, weight: 0.8, change: '+228%', changeType: 'increased' },
          { ticker: 'PCT', name: 'PureCycle', value: 30000, shares: 2282000, weight: 0.7, change: '—', changeType: 'unchanged' },
          { ticker: 'FWONK', name: 'Liberty F1', value: 30000, shares: 288000, weight: 0.7, change: 'NEW', changeType: 'new' },
          { ticker: 'DAKT', name: 'Daktronics', value: 30000, shares: 1434000, weight: 0.7, change: '-53%', changeType: 'decreased' },
          { ticker: 'DKS', name: "Dick's Sporting", value: 29000, shares: 132000, weight: 0.7, change: 'NEW', changeType: 'new' },
          { ticker: 'FLUT', name: 'Flutter', value: 29000, shares: 115000, weight: 0.7, change: '-71%', changeType: 'decreased' },
          { ticker: 'KBE', name: 'SPDR Bank ETF', value: 29000, shares: 482000, weight: 0.7, change: 'NEW', changeType: 'new' },
          { ticker: 'OPCH', name: 'Option Care', value: 27000, shares: 978000, weight: 0.7, change: '+53%', changeType: 'increased' },
          { ticker: 'AEVA', name: 'Aeva Tech', value: 27000, shares: 1862000, weight: 0.7, change: 'NEW', changeType: 'new' },
          { ticker: 'PCG', name: 'PG&E', value: 25000, shares: 1658000, weight: 0.6, change: 'NEW', changeType: 'new' },
          { ticker: 'GOOGL', name: 'Alphabet A', value: 25000, shares: 102000, weight: 0.6, change: 'NEW', changeType: 'new' },
          { ticker: 'ARM', name: 'ARM Holdings', value: 24000, shares: 168000, weight: 0.6, change: 'NEW', changeType: 'new' },
          { ticker: 'NU', name: 'Nubank', value: 23000, shares: 1454000, weight: 0.6, change: '-57%', changeType: 'decreased' },
          { ticker: 'SMTC', name: 'Semtech', value: 22000, shares: 302000, weight: 0.5, change: 'NEW', changeType: 'new' },
          { ticker: 'STX', name: 'Seagate', value: 20000, shares: 86000, weight: 0.5, change: '-56%', changeType: 'decreased' },
          { ticker: 'GPC', name: 'Genuine Parts', value: 20000, shares: 144000, weight: 0.5, change: 'NEW', changeType: 'new' },
          { ticker: 'ELVN', name: 'Enliven Therapeutics', value: 19000, shares: 947000, weight: 0.5, change: '+104%', changeType: 'increased' },
          { ticker: 'POST', name: 'Post Holdings', value: 19000, shares: 176000, weight: 0.5, change: 'NEW', changeType: 'new' },
          { ticker: 'SNDK', name: 'SanDisk', value: 19000, shares: 166000, weight: 0.5, change: 'NEW', changeType: 'new' },
          { ticker: 'SYF', name: 'Synchrony', value: 19000, shares: 262000, weight: 0.5, change: 'NEW', changeType: 'new' },
          { ticker: 'ARGT', name: 'Argentina ETF', value: 18000, shares: 254000, weight: 0.4, change: '-5%', changeType: 'decreased' },
          { ticker: 'COGT', name: 'Cogent Bio', value: 15000, shares: 1077000, weight: 0.4, change: 'NEW', changeType: 'new' },
          { ticker: 'PTGX', name: 'Protagonist', value: 11000, shares: 160000, weight: 0.3, change: 'NEW', changeType: 'new' },
          { ticker: 'COF', name: 'Capital One', value: 9300, shares: 44000, weight: 0.2, change: 'NEW', changeType: 'new' },
          { ticker: 'CMG', name: 'Chipotle', value: 9100, shares: 233000, weight: 0.2, change: 'NEW', changeType: 'new' },
          { ticker: 'SEI', name: 'Solaris Energy', value: 5800, shares: 146000, weight: 0.1, change: 'NEW', changeType: 'new' },
          { ticker: 'MDB', name: 'MongoDB', value: 5500, shares: 18000, weight: 0.1, change: 'NEW', changeType: 'new' },
          { ticker: 'TXRH', name: 'Texas Roadhouse', value: 5000, shares: 30000, weight: 0.1, change: 'NEW', changeType: 'new' },
          { ticker: 'SATS', name: 'EchoStar', value: 4600, shares: 61000, weight: 0.1, change: 'NEW', changeType: 'new' },
          { ticker: 'YPF', name: 'YPF Argentina', value: 2800, shares: 115000, weight: 0.1, change: '-83%', changeType: 'decreased' },
          { ticker: 'CHYM', name: 'Chime', value: 872, shares: 43000, weight: 0.0, change: '-90%', changeType: 'decreased' },
        ],
        newPositions: ['EEM', 'AMZN', 'FIGR', 'STUB', 'META', 'GEV', 'CRH', 'VST', 'CLF', 'FWONK', 'DKS', 'KBE', 'AEVA', 'PCG', 'GOOGL', 'ARM', 'SMTC', 'GPC', 'POST', 'SNDK', 'SYF', 'COGT', 'PTGX', 'COF', 'CMG', 'SEI', 'MDB', 'TXRH', 'SATS'],
        exitedPositions: ['APP', 'BWXT', 'BMA', 'BCS', 'AVGO', 'BLDR', 'CCCS', 'CZR', 'CC', 'COHR', 'MSFT', 'LLY', 'PM', 'WBD'],
      },
      'Q2 2025': {
        totalValue: 4071255,
        totalPositions: 69,
        holdings: [
          { ticker: 'NTRA', name: 'Natera Inc', value: 520000, shares: 3117000, weight: 12.8, change: '+8%', changeType: 'increased' },
          { ticker: 'TEVA', name: 'Teva Pharma', value: 290000, shares: 16108000, weight: 7.1, change: '+15%', changeType: 'increased' },
          { ticker: 'INSM', name: 'Insmed Inc', value: 244000, shares: 2376000, weight: 6.0, change: '+20%', changeType: 'increased' },
          { ticker: 'WWD', name: 'Woodward', value: 214000, shares: 844000, weight: 5.3, change: '+5%', changeType: 'increased' },
          { ticker: 'TSM', name: 'Taiwan Semi', value: 200000, shares: 765000, weight: 4.9, change: '—', changeType: 'unchanged' },
          { ticker: 'CPNG', name: 'Coupang', value: 130000, shares: 4130000, weight: 3.2, change: '+12%', changeType: 'increased' },
          { ticker: 'MELI', name: 'MercadoLibre', value: 126000, shares: 53876, weight: 3.1, change: '—', changeType: 'unchanged' },
          { ticker: 'MSFT', name: 'Microsoft', value: 100000, shares: 225000, weight: 2.5, change: '-30%', changeType: 'decreased' },
        ],
        newPositions: ['FLUT', 'CZR', 'ROKU'],
        exitedPositions: ['NVDA', 'GOOGL'],
      },
      'Q1 2025': {
        totalValue: 3060048,
        totalPositions: 52,
        holdings: [
          { ticker: 'NTRA', name: 'Natera Inc', value: 480000, shares: 2888000, weight: 15.7, change: '+10%', changeType: 'increased' },
          { ticker: 'TEVA', name: 'Teva Pharma', value: 252000, shares: 14007000, weight: 8.2, change: '+18%', changeType: 'increased' },
          { ticker: 'WWD', name: 'Woodward', value: 204000, shares: 804000, weight: 6.7, change: '+3%', changeType: 'increased' },
          { ticker: 'CPNG', name: 'Coupang', value: 200000, shares: 3688000, weight: 6.5, change: '+5%', changeType: 'increased' },
          { ticker: 'INSM', name: 'Insmed Inc', value: 198000, shares: 1980000, weight: 6.5, change: '+25%', changeType: 'increased' },
          { ticker: 'TSM', name: 'Taiwan Semi', value: 185000, shares: 765000, weight: 6.0, change: '—', changeType: 'unchanged' },
          { ticker: 'MSFT', name: 'Microsoft', value: 143000, shares: 322000, weight: 4.7, change: '-15%', changeType: 'decreased' },
        ],
        newPositions: ['DOCU', 'ROKU', 'VRNA'],
        exitedPositions: ['GOOGL', 'BABA'],
      },
    },
  },
  {
    id: 'tepper',
    name: 'David Tepper',
    fund: 'Appaloosa LP',
    style: 'Distressed / Event',
    location: 'Miami Beach, FL',
    quarters: {
      'Q3 2025': {
        totalValue: 7400000,
        totalPositions: 45,
        holdings: [
          { ticker: 'BABA', name: 'Alibaba', value: 1200000, shares: 6500000, weight: 15.6, change: '-8%', changeType: 'decreased' },
          { ticker: 'AMZN', name: 'Amazon', value: 549000, shares: 2500000, weight: 7.4, change: '-7%', changeType: 'decreased' },
          { ticker: 'WHR', name: 'Whirlpool', value: 432000, shares: 5500000, weight: 5.9, change: '+1966%', changeType: 'increased' },
          { ticker: 'NVDA', name: 'NVIDIA', value: 355000, shares: 1900000, weight: 4.8, change: '+8%', changeType: 'increased' },
          { ticker: 'GOOG', name: 'Alphabet C', value: 338000, shares: 1400000, weight: 4.6, change: '-7%', changeType: 'decreased' },
          { ticker: 'KWEB', name: 'China Internet ETF', value: 311000, shares: 7400000, weight: 4.2, change: '+85%', changeType: 'increased' },
          { ticker: 'NRG', name: 'NRG Energy', value: 303000, shares: 1900000, weight: 4.1, change: '-5%', changeType: 'decreased' },
          { ticker: 'TSM', name: 'Taiwan Semi', value: 296000, shares: 1100000, weight: 4.0, change: '+3%', changeType: 'increased' },
          { ticker: 'META', name: 'Meta', value: 272000, shares: 370000, weight: 3.7, change: '-7%', changeType: 'decreased' },
          { ticker: 'VST', name: 'Vistra Energy', value: 244000, shares: 1200000, weight: 3.3, change: '-30%', changeType: 'decreased' },
          { ticker: 'MSFT', name: 'Microsoft', value: 240000, shares: 463000, weight: 3.2, change: '-7%', changeType: 'decreased' },
          { ticker: 'PDD', name: 'PDD Holdings', value: 238000, shares: 1800000, weight: 3.2, change: '-10%', changeType: 'decreased' },
          { ticker: 'UBER', name: 'Uber', value: 236000, shares: 2400000, weight: 3.2, change: '-12%', changeType: 'decreased' },
          { ticker: 'JD', name: 'JD.com', value: 218000, shares: 6200000, weight: 2.9, change: '-11%', changeType: 'decreased' },
          { ticker: 'QCOM', name: 'Qualcomm', value: 207000, shares: 1200000, weight: 2.8, change: '+255%', changeType: 'increased' },
          { ticker: 'AMD', name: 'AMD', value: 154000, shares: 950000, weight: 2.1, change: 'NEW', changeType: 'new' },
          { ticker: 'BIDU', name: 'Baidu', value: 138000, shares: 1000000, weight: 1.9, change: '+67%', changeType: 'increased' },
          { ticker: 'DB', name: 'Deutsche Bank', value: 134000, shares: 3800000, weight: 1.8, change: '-5%', changeType: 'decreased' },
          { ticker: 'GLW', name: 'Corning', value: 133000, shares: 1600000, weight: 1.8, change: '-7%', changeType: 'decreased' },
          { ticker: 'LYFT', name: 'Lyft', value: 123000, shares: 5600000, weight: 1.7, change: '-30%', changeType: 'decreased' },
          { ticker: 'FI', name: 'Fiserv', value: 119000, shares: 925000, weight: 1.6, change: 'NEW', changeType: 'new' },
          { ticker: 'AAL', name: 'American Airlines', value: 104000, shares: 9300000, weight: 1.4, change: 'NEW', changeType: 'new' },
          { ticker: 'LHX', name: 'L3Harris', value: 92000, shares: 300000, weight: 1.2, change: '-14%', changeType: 'decreased' },
          { ticker: 'RTX', name: 'Raytheon', value: 85000, shares: 510000, weight: 1.2, change: '-12%', changeType: 'decreased' },
          { ticker: 'ET', name: 'Energy Transfer', value: 85000, shares: 5000000, weight: 1.2, change: '—', changeType: 'unchanged' },
          { ticker: 'MU', name: 'Micron', value: 84000, shares: 500000, weight: 1.1, change: '-39%', changeType: 'decreased' },
          { ticker: 'UNH', name: 'UnitedHealth', value: 70000, shares: 204000, weight: 1.0, change: '-91%', changeType: 'decreased' },
          { ticker: 'TFC', name: 'Truist Financial', value: 63000, shares: 1400000, weight: 0.9, change: 'NEW', changeType: 'new' },
          { ticker: 'ASML', name: 'ASML', value: 62000, shares: 64000, weight: 0.8, change: '-8%', changeType: 'decreased' },
          { ticker: 'CZR', name: 'Caesars', value: 57000, shares: 2100000, weight: 0.8, change: '—', changeType: 'unchanged' },
          { ticker: 'IQV', name: 'IQVIA', value: 54000, shares: 285000, weight: 0.7, change: '-5%', changeType: 'decreased' },
          { ticker: 'LRCX', name: 'Lam Research', value: 50000, shares: 370000, weight: 0.7, change: '-7%', changeType: 'decreased' },
          { ticker: 'FXI', name: 'China Large-Cap', value: 46000, shares: 1100000, weight: 0.6, change: '+11%', changeType: 'increased' },
          { ticker: 'UAL', name: 'United Airlines', value: 45000, shares: 463000, weight: 0.6, change: '-15%', changeType: 'decreased' },
          { ticker: 'GT', name: 'Goodyear', value: 38000, shares: 5100000, weight: 0.5, change: '+496%', changeType: 'increased' },
          { ticker: 'KEY', name: 'KeyCorp', value: 38000, shares: 2000000, weight: 0.5, change: 'NEW', changeType: 'new' },
          { ticker: 'CFG', name: 'Citizens Financial', value: 32000, shares: 600000, weight: 0.4, change: 'NEW', changeType: 'new' },
          { ticker: 'CMA', name: 'Comerica', value: 32000, shares: 463000, weight: 0.4, change: 'NEW', changeType: 'new' },
          { ticker: 'XYZ', name: 'Block', value: 27000, shares: 370000, weight: 0.4, change: '-42%', changeType: 'decreased' },
          { ticker: 'MPLX', name: 'MPLX LP', value: 27000, shares: 535000, weight: 0.4, change: '-7%', changeType: 'decreased' },
          { ticker: 'DAL', name: 'Delta Air Lines', value: 26000, shares: 463000, weight: 0.4, change: '-15%', changeType: 'decreased' },
          { ticker: 'OC', name: 'Owens Corning', value: 23000, shares: 162000, weight: 0.3, change: 'NEW', changeType: 'new' },
          { ticker: 'MHK', name: 'Mohawk Industries', value: 21000, shares: 162000, weight: 0.3, change: '+148%', changeType: 'increased' },
          { ticker: 'WAL', name: 'Western Alliance', value: 17000, shares: 195000, weight: 0.2, change: 'NEW', changeType: 'new' },
          { ticker: 'ZION', name: 'Zions Bancorp', value: 16000, shares: 285000, weight: 0.2, change: 'NEW', changeType: 'new' },
        ],
        newPositions: ['AMD', 'FI', 'AAL', 'TFC', 'KEY', 'CFG', 'CMA', 'OC', 'WAL', 'ZION'],
        exitedPositions: ['INTC', 'BEKE', 'ORCL'],
      },
      'Q2 2025': {
        totalValue: 6521000,
        totalPositions: 48,
        holdings: [
          { ticker: 'BABA', name: 'Alibaba', value: 1264000, shares: 7065000, weight: 19.4, change: '+5%', changeType: 'increased' },
          { ticker: 'AMZN', name: 'Amazon', value: 591000, shares: 2690000, weight: 9.1, change: '+3%', changeType: 'increased' },
          { ticker: 'GOOG', name: 'Alphabet C', value: 452000, shares: 2010000, weight: 6.9, change: '+8%', changeType: 'increased' },
          { ticker: 'META', name: 'Meta', value: 404000, shares: 550000, weight: 6.2, change: '+12%', changeType: 'increased' },
          { ticker: 'NVDA', name: 'NVIDIA', value: 59000, shares: 487000, weight: 0.9, change: '-40%', changeType: 'decreased' },
        ],
        newPositions: ['JD', 'KWEB'],
        exitedPositions: ['ORCL', 'INTC'],
      },
      'Q1 2025': {
        totalValue: 5890000,
        totalPositions: 52,
        holdings: [
          { ticker: 'BABA', name: 'Alibaba', value: 1204000, shares: 6729000, weight: 20.4, change: '+10%', changeType: 'increased' },
          { ticker: 'AMZN', name: 'Amazon', value: 574000, shares: 2612000, weight: 9.7, change: '+5%', changeType: 'increased' },
          { ticker: 'GOOG', name: 'Alphabet C', value: 419000, shares: 1862000, weight: 7.1, change: '+3%', changeType: 'increased' },
          { ticker: 'META', name: 'Meta', value: 361000, shares: 491000, weight: 6.1, change: '+8%', changeType: 'increased' },
        ],
        newPositions: ['PDD', 'UBER'],
        exitedPositions: ['MSFT', 'CRM'],
      },
    },
  },
  {
    id: 'burry',
    name: 'Michael Burry',
    fund: 'Scion Asset Management',
    style: 'Contrarian / Deep Value',
    location: 'Saratoga, CA',
    quarters: {
      'Q3 2025': {
        totalValue: 1381198,
        totalPositions: 8,
        holdings: [
          { ticker: 'PLTR', name: 'Palantir (PUT)', value: 912000, shares: 5000000, weight: 66.0, change: 'NEW', changeType: 'new' },
          { ticker: 'NVDA', name: 'NVIDIA (PUT)', value: 187000, shares: 1000000, weight: 13.5, change: 'NEW', changeType: 'new' },
          { ticker: 'PFE', name: 'Pfizer (CALL)', value: 153000, shares: 6000000, weight: 11.1, change: 'NEW', changeType: 'new' },
          { ticker: 'HAL', name: 'Halliburton (CALL)', value: 62000, shares: 2500000, weight: 4.5, change: 'NEW', changeType: 'new' },
          { ticker: 'MOH', name: 'Molina Healthcare', value: 24000, shares: 125000, weight: 1.7, change: 'NEW', changeType: 'new' },
          { ticker: 'LULU', name: 'Lululemon', value: 18000, shares: 100000, weight: 1.3, change: '-77%', changeType: 'decreased' },
          { ticker: 'SLM', name: 'SLM Corp', value: 13000, shares: 480000, weight: 1.0, change: 'NEW', changeType: 'new' },
          { ticker: 'BRKR', name: 'Bruker Pref', value: 13000, shares: 48000, weight: 0.9, change: 'NEW', changeType: 'new' },
        ],
        newPositions: ['PLTR Put', 'NVDA Put', 'PFE Call', 'HAL Call', 'MOH', 'SLM', 'BRKR'],
        exitedPositions: ['BABA', 'BRKR', 'META', 'JD', 'EL', 'MELI', 'REGN', 'UNH', 'VFC', 'ASML'],
      },
      'Q2 2025': {
        totalValue: 106000,
        totalPositions: 5,
        holdings: [
          { ticker: 'LULU', name: 'Lululemon', value: 45000, shares: 50000, weight: 42.5, change: '+25%', changeType: 'increased' },
          { ticker: 'EL', name: 'Estee Lauder', value: 25000, shares: 250000, weight: 23.6, change: '-20%', changeType: 'decreased' },
          { ticker: 'UNH', name: 'UnitedHealth', value: 20000, shares: 40000, weight: 18.9, change: '-15%', changeType: 'decreased' },
          { ticker: 'REGN', name: 'Regeneron', value: 16000, shares: 15000, weight: 15.1, change: '—', changeType: 'unchanged' },
        ],
        newPositions: [],
        exitedPositions: ['BABA', 'JD'],
      },
      'Q1 2025': {
        totalValue: 94000,
        totalPositions: 7,
        holdings: [
          { ticker: 'BABA', name: 'Alibaba', value: 35000, shares: 350000, weight: 37.2, change: '+5%', changeType: 'increased' },
          { ticker: 'EL', name: 'Estee Lauder', value: 31000, shares: 312000, weight: 33.0, change: '+10%', changeType: 'increased' },
          { ticker: 'LULU', name: 'Lululemon', value: 16000, shares: 40000, weight: 17.0, change: 'NEW', changeType: 'new' },
          { ticker: 'UNH', name: 'UnitedHealth', value: 12000, shares: 24000, weight: 12.8, change: '-10%', changeType: 'decreased' },
        ],
        newPositions: ['LULU'],
        exitedPositions: ['HCA', 'C'],
      },
    },
  },
  {
    id: 'griffin',
    name: 'Ken Griffin',
    fund: 'Citadel Advisors',
    style: 'Multi-Strategy / Quant',
    location: 'Miami, FL',
    quarters: {
      'Q3 2025': {
        totalValue: 657000000,
        totalPositions: 12624,
        holdings: [
          { ticker: 'SPY', name: 'S&P 500 Options', value: 27300000, shares: 41000000, weight: 4.2, change: '-37%', changeType: 'decreased' },
          { ticker: 'QQQ', name: 'Nasdaq 100 Options', value: 18600000, shares: 37400000, weight: 2.8, change: '+17%', changeType: 'increased' },
          { ticker: 'TSLA', name: 'Tesla Options', value: 9800000, shares: 38500000, weight: 1.5, change: '+19%', changeType: 'increased' },
          { ticker: 'NVDA', name: 'NVIDIA', value: 6200000, shares: 51000000, weight: 0.9, change: '-21%', changeType: 'decreased' },
          { ticker: 'AAPL', name: 'Apple', value: 4800000, shares: 21000000, weight: 0.7, change: '+51%', changeType: 'increased' },
          { ticker: 'GLD', name: 'Gold ETF', value: 4200000, shares: 11800000, weight: 0.6, change: 'NEW', changeType: 'new' },
          { ticker: 'UNH', name: 'UnitedHealth', value: 2800000, shares: 8100000, weight: 0.4, change: 'NEW', changeType: 'new' },
          { ticker: 'MSFT', name: 'Microsoft', value: 2700000, shares: 5200000, weight: 0.4, change: '+100%', changeType: 'increased' },
          { ticker: 'MSTR', name: 'MicroStrategy', value: 2200000, shares: 6800000, weight: 0.3, change: 'NEW', changeType: 'new' },
          { ticker: 'GOOG', name: 'Alphabet', value: 2100000, shares: 8600000, weight: 0.3, change: '+100%', changeType: 'increased' },
          { ticker: 'IWM', name: 'Russell 2000', value: 1900000, shares: 7800000, weight: 0.3, change: '-47%', changeType: 'decreased' },
          { ticker: 'AMZN', name: 'Amazon', value: 1400000, shares: 6400000, weight: 0.2, change: '+55%', changeType: 'increased' },
          { ticker: 'ORCL', name: 'Oracle', value: 1500000, shares: 5300000, weight: 0.2, change: '+150%', changeType: 'increased' },
          { ticker: 'META', name: 'Meta', value: 1300000, shares: 1800000, weight: 0.2, change: '+25%', changeType: 'increased' },
          { ticker: 'NFLX', name: 'Netflix', value: 1200000, shares: 1000000, weight: 0.2, change: '-50%', changeType: 'decreased' },
        ],
        newPositions: ['GLD', 'UNH', 'MSTR', 'ETF Opportunities Trust', 'CPSS', 'STEX'],
        exitedPositions: ['FWD', 'CPLS', 'ACCO', 'EQL', 'DTEC', 'SBIO', 'EDOG', 'ENFR', 'AEF', 'GLTR'],
      },
      'Q2 2025': {
        totalValue: 550000000,
        totalPositions: 11800,
        holdings: [
          { ticker: 'SPY', name: 'S&P 500 (PUT)', value: 18200000, shares: 27333000, weight: 3.3, change: '+20%', changeType: 'increased' },
          { ticker: 'QQQ', name: 'Nasdaq 100 (PUT)', value: 13800000, shares: 27700000, weight: 2.5, change: '+18%', changeType: 'increased' },
          { ticker: 'NVDA', name: 'NVIDIA', value: 1510000, shares: 12500000, weight: 0.27, change: '+10%', changeType: 'increased' },
          { ticker: 'MSFT', name: 'Microsoft', value: 1030000, shares: 2450000, weight: 0.19, change: '+5%', changeType: 'increased' },
        ],
        newPositions: ['TSLA Call', 'GOOGL'],
        exitedPositions: ['SCHW'],
      },
      'Q1 2025': {
        totalValue: 480000000,
        totalPositions: 11200,
        holdings: [
          { ticker: 'SPY', name: 'S&P 500 (PUT)', value: 15200000, shares: 22778000, weight: 3.2, change: '+12%', changeType: 'increased' },
          { ticker: 'QQQ', name: 'Nasdaq 100 (PUT)', value: 11700000, shares: 23475000, weight: 2.4, change: '+10%', changeType: 'increased' },
          { ticker: 'NVDA', name: 'NVIDIA', value: 1370000, shares: 11363000, weight: 0.29, change: '+15%', changeType: 'increased' },
        ],
        newPositions: ['COST', 'PANW'],
        exitedPositions: ['HES'],
      },
    },
  },
  {
    id: 'tudor',
    name: 'Paul Tudor Jones',
    fund: 'Tudor Investment Corp',
    style: 'Global Macro',
    location: 'Stamford, CT',
    quarters: {
      'Q3 2025': {
        totalValue: 58000000,
        totalPositions: 2032,
        holdings: [
          { ticker: 'IWM', name: 'Russell 2000 (CALL)', value: 12000000, shares: 48000000, weight: 20.0, change: '-3%', changeType: 'decreased' },
          { ticker: 'QQQ', name: 'Nasdaq 100 (CALL)', value: 4700000, shares: 7800000, weight: 8.1, change: '+30%', changeType: 'increased' },
          { ticker: 'SPY', name: 'S&P 500 (CALL)', value: 3400000, shares: 5100000, weight: 5.9, change: '+156%', changeType: 'increased' },
          { ticker: 'XLE', name: 'Energy ETF (CALL)', value: 974000, shares: 11000000, weight: 1.7, change: '+38%', changeType: 'increased' },
          { ticker: 'FXI', name: 'China Large-Cap (CALL)', value: 800000, shares: 20000000, weight: 1.4, change: '+268%', changeType: 'increased' },
          { ticker: 'NVDA', name: 'NVIDIA', value: 638000, shares: 3400000, weight: 1.1, change: '+75%', changeType: 'increased' },
          { ticker: 'EEM', name: 'EM ETF (CALL)', value: 558000, shares: 10000000, weight: 1.0, change: '+40%', changeType: 'increased' },
          { ticker: 'UNH', name: 'UnitedHealth', value: 510000, shares: 1500000, weight: 0.9, change: '+39%', changeType: 'increased' },
          { ticker: 'XLU', name: 'Utilities ETF (CALL)', value: 499000, shares: 5700000, weight: 0.9, change: '+8%', changeType: 'increased' },
          { ticker: 'XLF', name: 'Financial ETF (CALL)', value: 486000, shares: 9000000, weight: 0.8, change: '+68%', changeType: 'increased' },
          { ticker: 'PLTR', name: 'Palantir', value: 456000, shares: 2500000, weight: 0.8, change: '+7%', changeType: 'increased' },
          { ticker: 'ORCL', name: 'Oracle (CALL)', value: 434000, shares: 1500000, weight: 0.7, change: '+90%', changeType: 'increased' },
          { ticker: 'MU', name: 'Micron', value: 409000, shares: 2400000, weight: 0.7, change: '+10%', changeType: 'increased' },
          { ticker: 'GS', name: 'Goldman Sachs (CALL)', value: 390000, shares: 489000, weight: 0.7, change: '+8%', changeType: 'increased' },
          { ticker: 'AAPL', name: 'Apple', value: 386000, shares: 1500000, weight: 0.7, change: '-7%', changeType: 'decreased' },
          { ticker: 'HOOD', name: 'Robinhood (CALL)', value: 350000, shares: 2400000, weight: 0.6, change: '-15%', changeType: 'decreased' },
          { ticker: 'MSFT', name: 'Microsoft', value: 322000, shares: 621000, weight: 0.6, change: '—', changeType: 'unchanged' },
          { ticker: 'ADBE', name: 'Adobe (CALL)', value: 312000, shares: 885000, weight: 0.5, change: '+72%', changeType: 'increased' },
          { ticker: 'AMD', name: 'AMD (CALL)', value: 310000, shares: 1900000, weight: 0.5, change: '-19%', changeType: 'decreased' },
          { ticker: 'APP', name: 'AppLovin (CALL)', value: 305000, shares: 425000, weight: 0.5, change: '+67%', changeType: 'increased' },
          { ticker: 'AVGO', name: 'Broadcom', value: 303000, shares: 919000, weight: 0.5, change: '-2%', changeType: 'decreased' },
          { ticker: 'KRE', name: 'Regional Banks (CALL)', value: 292000, shares: 4600000, weight: 0.5, change: '-9%', changeType: 'decreased' },
          { ticker: 'LULU', name: 'Lululemon', value: 275000, shares: 1500000, weight: 0.5, change: '+347%', changeType: 'increased' },
          { ticker: 'NFLX', name: 'Netflix', value: 268000, shares: 224000, weight: 0.5, change: '-2%', changeType: 'decreased' },
          { ticker: 'META', name: 'Meta', value: 267000, shares: 364000, weight: 0.5, change: '-32%', changeType: 'decreased' },
          { ticker: 'GOOGL', name: 'Alphabet A (CALL)', value: 247000, shares: 1000000, weight: 0.4, change: '-20%', changeType: 'decreased' },
          { ticker: 'CAT', name: 'Caterpillar (CALL)', value: 243000, shares: 510000, weight: 0.4, change: '+106%', changeType: 'increased' },
          { ticker: 'KWEB', name: 'China Internet (CALL)', value: 234000, shares: 5600000, weight: 0.4, change: '+340%', changeType: 'increased' },
          { ticker: 'JPM', name: 'JPMorgan (CALL)', value: 232000, shares: 734000, weight: 0.4, change: '-16%', changeType: 'decreased' },
          { ticker: 'TSM', name: 'Taiwan Semi', value: 224000, shares: 802000, weight: 0.4, change: '-17%', changeType: 'decreased' },
          { ticker: 'AMZN', name: 'Amazon', value: 221000, shares: 1000000, weight: 0.4, change: '+2%', changeType: 'increased' },
          { ticker: 'MRK', name: 'Merck', value: 220000, shares: 2600000, weight: 0.4, change: '+30%', changeType: 'increased' },
          { ticker: 'BRK.B', name: 'Berkshire (CALL)', value: 218000, shares: 433000, weight: 0.4, change: '-41%', changeType: 'decreased' },
          { ticker: 'IBIT', name: 'Bitcoin ETF (CALL)', value: 217000, shares: 3300000, weight: 0.4, change: '-25%', changeType: 'decreased' },
          { ticker: 'WMT', name: 'Walmart', value: 214000, shares: 2100000, weight: 0.4, change: '+26%', changeType: 'increased' },
          { ticker: 'GLD', name: 'Gold ETF (CALL)', value: 212000, shares: 596000, weight: 0.4, change: '+88%', changeType: 'increased' },
          { ticker: 'C', name: 'Citigroup (CALL)', value: 208000, shares: 2000000, weight: 0.4, change: '+54%', changeType: 'increased' },
          { ticker: 'SOFI', name: 'SoFi', value: 205000, shares: 7800000, weight: 0.4, change: '+124%', changeType: 'increased' },
          { ticker: 'TGT', name: 'Target (CALL)', value: 189000, shares: 2100000, weight: 0.3, change: '+5%', changeType: 'increased' },
          { ticker: 'JNJ', name: 'J&J (CALL)', value: 188000, shares: 1000000, weight: 0.3, change: '+165%', changeType: 'increased' },
        ],
        newPositions: ['SNAP', 'F', 'MRUS', 'PSKY', 'Firefly Aerospace'],
        exitedPositions: ['AGCO', 'ABL', 'ACHC', 'ACIW', 'AYI', 'WMS', 'AMG', 'ALX', 'ATUS', 'KNTK'],
      },
      'Q2 2025': {
        totalValue: 45918919,
        totalPositions: 3177,
        holdings: [
          { ticker: 'IWM', name: 'Russell 2000 (PUT)', value: 5190000, shares: 21463000, weight: 11.3, change: '+25%', changeType: 'increased' },
          { ticker: 'IWM', name: 'Russell 2000 (CALL)', value: 2966000, shares: 12264000, weight: 6.5, change: '+20%', changeType: 'increased' },
          { ticker: 'IBIT', name: 'Bitcoin ETF', value: 38000, shares: 690000, weight: 0.1, change: 'NEW', changeType: 'new' },
        ],
        newPositions: ['IBIT', 'FXI'],
        exitedPositions: ['SGEN', 'ATVI'],
      },
      'Q1 2025': {
        totalValue: 30095626,
        totalPositions: 2975,
        holdings: [
          { ticker: 'IWM', name: 'Russell 2000 (PUT)', value: 4152000, shares: 17171000, weight: 13.8, change: '+15%', changeType: 'increased' },
          { ticker: 'IWM', name: 'Russell 2000 (CALL)', value: 2472000, shares: 10220000, weight: 8.2, change: '+12%', changeType: 'increased' },
        ],
        newPositions: ['XLE Put', 'EWZ Call'],
        exitedPositions: ['HZNP', 'COUP'],
      },
    },
  },
  {
    id: 'soros',
    name: 'George Soros',
    fund: 'Soros Fund Management',
    style: 'Global Macro',
    location: 'New York, NY',
    quarters: {
      'Q3 2025': {
        totalValue: 7020739,
        totalPositions: 184,
        holdings: [
          { ticker: 'AMZN', name: 'Amazon', value: 521000, shares: 2226187, weight: 7.4, change: '+50%', changeType: 'increased' },
          { ticker: 'SW', name: 'Smurfit WestRock', value: 455000, shares: 7500000, weight: 6.5, change: '+8%', changeType: 'increased' },
          { ticker: 'GOOGL', name: 'Alphabet A', value: 221000, shares: 910000, weight: 3.2, change: '-20%', changeType: 'decreased' },
          { ticker: 'RSP', name: 'S&P Equal Weight', value: 217000, shares: 1300000, weight: 3.1, change: 'NEW', changeType: 'new' },
          { ticker: 'TKO', name: 'TKO Group', value: 173000, shares: 1200000, weight: 2.5, change: '+15%', changeType: 'increased' },
          { ticker: 'GFL', name: 'GFL Environmental', value: 160000, shares: 2850000, weight: 2.3, change: '-69%', changeType: 'decreased' },
          { ticker: 'SPOT', name: 'Spotify', value: 140000, shares: 310000, weight: 2.0, change: '+25%', changeType: 'increased' },
          { ticker: 'DBX', name: 'Dropbox', value: 125000, shares: 4800000, weight: 1.8, change: '+10%', changeType: 'increased' },
          { ticker: 'GPMT', name: 'Global Payments', value: 115000, shares: 1100000, weight: 1.6, change: 'NEW', changeType: 'new' },
          { ticker: 'FIGR', name: 'Figure Tech', value: 72000, shares: 2000000, weight: 1.0, change: 'NEW', changeType: 'new' },
          { ticker: 'DIS', name: 'Disney', value: 68000, shares: 620000, weight: 1.0, change: 'NEW', changeType: 'new' },
        ],
        newPositions: ['RSP', 'FIGR', 'DIS', 'GPMT', 'IWM', 'QQQ', 'KODK'],
        exitedPositions: ['LBRDK', 'AER', 'BRO', 'ASTS', 'AFRM'],
      },
      'Q2 2025': {
        totalValue: 8650000,
        totalPositions: 197,
        holdings: [
          { ticker: 'GFL', name: 'GFL Environmental', value: 517000, shares: 9188000, weight: 6.0, change: '+20%', changeType: 'increased' },
          { ticker: 'SW', name: 'Smurfit WestRock', value: 421000, shares: 6944000, weight: 4.9, change: '+5%', changeType: 'increased' },
          { ticker: 'AMZN', name: 'Amazon', value: 347000, shares: 1484000, weight: 4.0, change: '+12%', changeType: 'increased' },
          { ticker: 'GOOGL', name: 'Alphabet A', value: 276000, shares: 1138000, weight: 3.2, change: '+3%', changeType: 'increased' },
        ],
        newPositions: ['IWM', 'QQQ', 'TKO'],
        exitedPositions: ['ASTS', 'AFRM', 'AA'],
      },
      'Q1 2025': {
        totalValue: 7800000,
        totalPositions: 185,
        holdings: [
          { ticker: 'GFL', name: 'GFL Environmental', value: 431000, shares: 7657000, weight: 5.5, change: '+15%', changeType: 'increased' },
          { ticker: 'SW', name: 'Smurfit WestRock', value: 401000, shares: 6613000, weight: 5.1, change: '+10%', changeType: 'increased' },
          { ticker: 'AMZN', name: 'Amazon', value: 310000, shares: 1325000, weight: 4.0, change: '+8%', changeType: 'increased' },
        ],
        newPositions: ['GLXY', 'TPG', 'NXT'],
        exitedPositions: ['SPOT', 'DBX'],
      },
    },
  },
  {
    id: 'lilu',
    name: 'Li Lu',
    fund: 'Himalaya Capital',
    style: 'Deep Value / Long-term',
    location: 'Seattle, WA',
    quarters: {
      'Q3 2025': {
        totalValue: 3230265,
        totalPositions: 9,
        holdings: [
          { ticker: 'GOOGL', name: 'Alphabet A', value: 618000, shares: 2500000, weight: 19.1, change: '—', changeType: 'unchanged' },
          { ticker: 'PDD', name: 'PDD Holdings', value: 609000, shares: 4600000, weight: 18.9, change: '—', changeType: 'unchanged' },
          { ticker: 'GOOG', name: 'Alphabet C', value: 597000, shares: 2500000, weight: 18.5, change: '—', changeType: 'unchanged' },
          { ticker: 'BAC', name: 'Bank of America', value: 538000, shares: 10000000, weight: 16.7, change: '—', changeType: 'unchanged' },
          { ticker: 'BRK.B', name: 'Berkshire B', value: 451000, shares: 898000, weight: 14.0, change: '—', changeType: 'unchanged' },
          { ticker: 'EWBC', name: 'East West Bank', value: 296000, shares: 2800000, weight: 9.1, change: '—', changeType: 'unchanged' },
          { ticker: 'OXY', name: 'Occidental Petro', value: 69000, shares: 1500000, weight: 2.1, change: '—', changeType: 'unchanged' },
          { ticker: 'AAPL', name: 'Apple', value: 28000, shares: 111000, weight: 0.9, change: '—', changeType: 'unchanged' },
          { ticker: 'SOC', name: 'Sable Offshore', value: 23000, shares: 1300000, weight: 0.7, change: '—', changeType: 'unchanged' },
        ],
        newPositions: [],
        exitedPositions: [],
      },
      'Q2 2025': {
        totalValue: 2664000,
        totalPositions: 9,
        holdings: [
          { ticker: 'PDD', name: 'PDD Holdings', value: 477000, shares: 5000000, weight: 17.9, change: 'NEW', changeType: 'new' },
          { ticker: 'BAC', name: 'Bank of America', value: 489000, shares: 18034500, weight: 18.4, change: '-25%', changeType: 'decreased' },
          { ticker: 'GOOGL', name: 'Alphabet A', value: 444000, shares: 2543300, weight: 16.7, change: '—', changeType: 'unchanged' },
          { ticker: 'BRK.B', name: 'Berkshire B', value: 432000, shares: 962600, weight: 16.2, change: '—', changeType: 'unchanged' },
          { ticker: 'GOOG', name: 'Alphabet C', value: 430000, shares: 2451300, weight: 16.2, change: '—', changeType: 'unchanged' },
          { ticker: 'EWBC', name: 'East West Bank', value: 218000, shares: 2775000, weight: 8.2, change: '—', changeType: 'unchanged' },
        ],
        newPositions: ['PDD'],
        exitedPositions: [],
      },
      'Q1 2025': {
        totalValue: 2880000,
        totalPositions: 9,
        holdings: [
          { ticker: 'BAC', name: 'Bank of America', value: 649000, shares: 23969000, weight: 22.5, change: '-23%', changeType: 'decreased' },
          { ticker: 'GOOGL', name: 'Alphabet A', value: 490000, shares: 2543300, weight: 17.0, change: '—', changeType: 'unchanged' },
          { ticker: 'GOOG', name: 'Alphabet C', value: 477000, shares: 3044000, weight: 16.6, change: '-19%', changeType: 'decreased' },
          { ticker: 'BRK.B', name: 'Berkshire B', value: 453000, shares: 962600, weight: 15.7, change: '—', changeType: 'unchanged' },
          { ticker: 'EWBC', name: 'East West Bank', value: 182000, shares: 2775000, weight: 6.3, change: '—', changeType: 'unchanged' },
          { ticker: 'AAPL', name: 'Apple', value: 32000, shares: 110500, weight: 1.1, change: '-65%', changeType: 'decreased' },
        ],
        newPositions: [],
        exitedPositions: ['MU'],
      },
    },
  },
];

const QUARTERS = ['Q3 2025', 'Q2 2025', 'Q1 2025'];

type SortKey = 'weight' | 'change' | 'value' | 'ticker';
type SortOrder = 'asc' | 'desc';

export default function Dashboard() {
  const [selectedInvestor, setSelectedInvestor] = useState(INVESTORS[0]);
  const [selectedQuarter, setSelectedQuarter] = useState('Q3 2025');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('weight');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [filterType, setFilterType] = useState<string>('all');

  const quarterData = selectedInvestor.quarters[selectedQuarter];

  // Parse change percentage for sorting
  const parseChange = (change: string): number => {
    if (change === 'NEW') return 10000;
    if (change === '—') return 0;
    const match = change.match(/([+-]?\d+)/);
    return match ? parseInt(match[1]) : 0;
  };

  // Filter and sort holdings
  const filteredAndSortedHoldings = useMemo(() => {
    let holdings = quarterData?.holdings || [];

    // Filter by search
    if (searchTerm) {
      holdings = holdings.filter(h =>
        h.ticker.toLowerCase().includes(searchTerm.toLowerCase()) ||
        h.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by type
    if (filterType !== 'all') {
      holdings = holdings.filter(h => h.changeType === filterType);
    }

    // Sort
    holdings = [...holdings].sort((a, b) => {
      let comparison = 0;
      switch (sortKey) {
        case 'weight':
          comparison = a.weight - b.weight;
          break;
        case 'change':
          comparison = parseChange(a.change) - parseChange(b.change);
          break;
        case 'value':
          comparison = a.value - b.value;
          break;
        case 'ticker':
          comparison = a.ticker.localeCompare(b.ticker);
          break;
      }
      return sortOrder === 'desc' ? -comparison : comparison;
    });

    return holdings;
  }, [quarterData, searchTerm, filterType, sortKey, sortOrder]);

  const formatValue = (val: number) => {
    if (val >= 1000000) return `$${(val / 1000000).toFixed(2)}B`;
    if (val >= 1000) return `$${(val / 1000).toFixed(0)}M`;
    return `$${val}K`;
  };

  const formatShares = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(2)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
    return num.toString();
  };

  const getChangeColor = (type: string) => {
    switch (type) {
      case 'new': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'increased': return 'bg-green-100 text-green-800 border-green-300';
      case 'decreased': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-600 border-gray-300';
    }
  };

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
    } else {
      setSortKey(key);
      setSortOrder('desc');
    }
  };

  const SortIcon = ({ active, order }: { active: boolean; order: SortOrder }) => (
    <span className={`ml-1 ${active ? 'text-blue-600' : 'text-gray-400'}`}>
      {active ? (order === 'desc' ? '↓' : '↑') : '↕'}
    </span>
  );

  const newCount = quarterData?.holdings.filter(h => h.changeType === 'new').length || 0;
  const increasedCount = quarterData?.holdings.filter(h => h.changeType === 'increased').length || 0;
  const decreasedCount = quarterData?.holdings.filter(h => h.changeType === 'decreased').length || 0;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Header */}
      <header className="border-b border-gray-200 sticky top-0 bg-white z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="font-bold text-xl">13F</span>
              <span className="text-gray-400 text-sm hidden sm:inline">Legendary Investors Tracker</span>
            </div>
            <div className="flex gap-1">
              {QUARTERS.map(q => (
                <button
                  key={q}
                  onClick={() => setSelectedQuarter(q)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition ${
                    selectedQuarter === q
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-3">
        {/* Investor Tabs */}
        <div className="flex gap-1.5 overflow-x-auto pb-3 mb-3">
          {INVESTORS.map(inv => (
            <button
              key={inv.id}
              onClick={() => setSelectedInvestor(inv)}
              className={`px-4 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition ${
                selectedInvestor.id === inv.id
                  ? 'bg-blue-600 text-white shadow'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {inv.name.split(' ').pop()}
            </button>
          ))}
        </div>

        {/* Investor Info */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-3 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-xl font-bold">{selectedInvestor.name}</h1>
              <p className="text-sm text-gray-500 mt-1">
                {selectedInvestor.fund} · {selectedInvestor.location}
              </p>
              <span className="inline-block mt-2 px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded-full">
                {selectedInvestor.style}
              </span>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-blue-600">{formatValue(quarterData?.totalValue || 0)}</p>
              <p className="text-sm text-gray-500">{quarterData?.totalPositions || 0} positions</p>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-4 gap-2 mb-3">
          <button
            onClick={() => setFilterType('all')}
            className={`rounded-lg p-3 text-left transition ${filterType === 'all' ? 'bg-blue-600 text-white' : 'bg-white border border-gray-200'}`}
          >
            <p className="text-[10px] uppercase opacity-70">Total</p>
            <p className="font-bold text-lg">{quarterData?.totalPositions || 0}</p>
          </button>
          <button
            onClick={() => setFilterType('new')}
            className={`rounded-lg p-3 text-left transition ${filterType === 'new' ? 'bg-blue-600 text-white' : 'bg-white border border-gray-200'}`}
          >
            <p className="text-[10px] uppercase opacity-70">New</p>
            <p className="font-bold text-lg text-blue-600">{newCount}</p>
          </button>
          <button
            onClick={() => setFilterType('increased')}
            className={`rounded-lg p-3 text-left transition ${filterType === 'increased' ? 'bg-blue-600 text-white' : 'bg-white border border-gray-200'}`}
          >
            <p className="text-[10px] uppercase opacity-70">Added</p>
            <p className="font-bold text-lg text-green-600">{increasedCount}</p>
          </button>
          <button
            onClick={() => setFilterType('decreased')}
            className={`rounded-lg p-3 text-left transition ${filterType === 'decreased' ? 'bg-blue-600 text-white' : 'bg-white border border-gray-200'}`}
          >
            <p className="text-[10px] uppercase opacity-70">Trimmed</p>
            <p className="font-bold text-lg text-red-600">{decreasedCount}</p>
          </button>
        </div>

        {/* Activity Summary */}
        {(quarterData?.newPositions.length > 0 || quarterData?.exitedPositions.length > 0) && (
          <div className="grid grid-cols-2 gap-2 mb-3">
            {quarterData.newPositions.length > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-[10px] font-bold text-blue-700 mb-1">🆕 NEW POSITIONS ({quarterData.newPositions.length})</p>
                <p className="text-xs text-blue-800 font-mono">{quarterData.newPositions.join(', ')}</p>
              </div>
            )}
            {quarterData.exitedPositions.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-[10px] font-bold text-red-700 mb-1">🚪 EXITED ({quarterData.exitedPositions.length})</p>
                <p className="text-xs text-red-800 font-mono">{quarterData.exitedPositions.join(', ')}</p>
              </div>
            )}
          </div>
        )}

        {/* Search */}
        <input
          type="text"
          placeholder="🔍 Search ticker or company..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Table */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-3 px-3 font-semibold text-gray-600 w-10">#</th>
                  <th 
                    className="text-left py-3 px-3 font-semibold text-gray-600 cursor-pointer hover:text-blue-600"
                    onClick={() => handleSort('ticker')}
                  >
                    Ticker <SortIcon active={sortKey === 'ticker'} order={sortOrder} />
                  </th>
                  <th className="text-left py-3 px-3 font-semibold text-gray-600">Company</th>
                  <th className="text-left py-3 px-3 font-semibold text-gray-600 hidden md:table-cell">Description</th>
                  <th className="text-right py-3 px-3 font-semibold text-gray-600 hidden lg:table-cell">Mkt Cap</th>
                  <th 
                    className="text-right py-3 px-3 font-semibold text-gray-600 cursor-pointer hover:text-blue-600"
                    onClick={() => handleSort('value')}
                  >
                    Value <SortIcon active={sortKey === 'value'} order={sortOrder} />
                  </th>
                  <th className="text-right py-3 px-3 font-semibold text-gray-600 hidden sm:table-cell">Shares</th>
                  <th 
                    className="text-right py-3 px-3 font-semibold text-gray-600 cursor-pointer hover:text-blue-600"
                    onClick={() => handleSort('weight')}
                  >
                    Weight <SortIcon active={sortKey === 'weight'} order={sortOrder} />
                  </th>
                  <th 
                    className="text-center py-3 px-3 font-semibold text-gray-600 cursor-pointer hover:text-blue-600"
                    onClick={() => handleSort('change')}
                  >
                    Chg <SortIcon active={sortKey === 'change'} order={sortOrder} />
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredAndSortedHoldings.map((h, idx) => {
                  const info = getStockInfo(h.ticker);
                  return (
                    <tr key={`${h.ticker}-${idx}`} className="border-t border-gray-100 hover:bg-blue-50 transition">
                      <td className="py-2 px-3 text-gray-400 font-mono">{idx + 1}</td>
                      <td className="py-2 px-3 font-mono font-bold text-blue-700">{h.ticker}</td>
                      <td className="py-2 px-3 text-gray-800">{h.name}</td>
                      <td className="py-2 px-3 text-gray-500 text-[10px] hidden md:table-cell max-w-[200px] truncate">{info.desc}</td>
                      <td className="py-2 px-3 text-right text-gray-400 font-mono text-[10px] hidden lg:table-cell">{info.marketCap}</td>
                      <td className="py-2 px-3 text-right font-mono font-medium">{formatValue(h.value)}</td>
                      <td className="py-2 px-3 text-right font-mono text-gray-500 hidden sm:table-cell">{formatShares(h.shares)}</td>
                      <td className="py-2 px-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <div className="w-16 bg-gray-100 rounded-full h-1.5 hidden sm:block">
                            <div 
                              className="bg-blue-500 h-1.5 rounded-full" 
                              style={{ width: `${Math.min(h.weight * 3, 100)}%` }}
                            />
                          </div>
                          <span className="font-mono font-medium w-12 text-right">{h.weight.toFixed(1)}%</span>
                        </div>
                      </td>
                      <td className="py-2 px-3 text-center">
                        <span className={`inline-block px-2 py-1 rounded text-[10px] font-bold border ${getChangeColor(h.changeType)}`}>
                          {h.change}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-4 pt-3 text-center">
          <p className="text-[10px] text-gray-400">
            Data from SEC 13F filings · {selectedQuarter} · Educational purposes only · Not financial advice
          </p>
        </footer>
      </div>
    </div>
  );
}
