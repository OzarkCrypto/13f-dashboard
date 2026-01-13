'use client';

import { useState } from 'react';

// 주식 설명 데이터
const STOCK_INFO: Record<string, { desc: string; marketCap: string }> = {
  'NTRA': { desc: 'Genetic testing diagnostics', marketCap: '$21B' },
  'INSM': { desc: 'Rare disease biotech', marketCap: '$13B' },
  'TEVA': { desc: 'Generic pharma leader', marketCap: '$19B' },
  'TSM': { desc: 'Semiconductor foundry #1', marketCap: '$900B' },
  'WWD': { desc: 'Aerospace components', marketCap: '$9B' },
  'CPNG': { desc: 'Korea e-commerce giant', marketCap: '$58B' },
  'MELI': { desc: 'LatAm e-commerce leader', marketCap: '$105B' },
  'DOCU': { desc: 'E-signature software', marketCap: '$17B' },
  'VRNA': { desc: 'Respiratory disease biotech', marketCap: '$6B' },
  'AMZN': { desc: 'E-commerce & cloud giant', marketCap: '$2.3T' },
  'META': { desc: 'Social media & ads', marketCap: '$1.5T' },
  'NVDA': { desc: 'AI chips leader', marketCap: '$3.4T' },
  'MSFT': { desc: 'Software & cloud giant', marketCap: '$3.1T' },
  'GOOGL': { desc: 'Search & ads monopoly', marketCap: '$2.1T' },
  'GOOG': { desc: 'Search & ads (Class C)', marketCap: '$2.1T' },
  'AAPL': { desc: 'Consumer tech leader', marketCap: '$3.5T' },
  'BABA': { desc: 'China e-commerce titan', marketCap: '$230B' },
  'IWM': { desc: 'Russell 2000 ETF', marketCap: 'ETF' },
  'SPY': { desc: 'S&P 500 ETF', marketCap: 'ETF' },
  'QQQ': { desc: 'Nasdaq 100 ETF', marketCap: 'ETF' },
  'IBIT': { desc: 'Bitcoin spot ETF', marketCap: 'ETF' },
  'TSLA': { desc: 'EV & energy company', marketCap: '$1.3T' },
  'BAC': { desc: 'Major US bank', marketCap: '$350B' },
  'BRK.B': { desc: 'Buffett conglomerate', marketCap: '$1T' },
  'PDD': { desc: 'China discount e-commerce', marketCap: '$150B' },
  'EWBC': { desc: 'US-China focused bank', marketCap: '$13B' },
  'OXY': { desc: 'Oil & gas producer', marketCap: '$42B' },
  'WHR': { desc: 'Home appliances maker', marketCap: '$5B' },
  'PLTR': { desc: 'AI data analytics (Put)', marketCap: '$180B' },
  'MOH': { desc: 'Medicaid managed care', marketCap: '$20B' },
  'LULU': { desc: 'Athletic apparel brand', marketCap: '$38B' },
  'SLM': { desc: 'Student loan servicer', marketCap: '$6B' },
  'PFE': { desc: 'Big pharma (Call)', marketCap: '$140B' },
  'HAL': { desc: 'Oilfield services (Call)', marketCap: '$25B' },
  'V': { desc: 'Payment network leader', marketCap: '$580B' },
  'SW': { desc: 'Paper packaging company', marketCap: '$25B' },
  'RSP': { desc: 'Equal weight S&P ETF', marketCap: 'ETF' },
  'TKO': { desc: 'WWE & UFC sports media', marketCap: '$22B' },
  'GFL': { desc: 'Canada waste services', marketCap: '$18B' },
  'FIGR': { desc: 'Blockchain fintech IPO', marketCap: '$3B' },
  'GEV': { desc: 'GE power spin-off', marketCap: '$95B' },
  'AMD': { desc: 'CPU & GPU chipmaker', marketCap: '$200B' },
  'QCOM': { desc: 'Mobile chip leader', marketCap: '$180B' },
};

const getStockInfo = (ticker: string) => STOCK_INFO[ticker] || { desc: '—', marketCap: '—' };

// 투자자 데이터
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
        totalPositions: 65,
        holdings: [
          { ticker: 'NTRA', name: 'Natera Inc', value: 534000, shares: 3300000, weight: 13.1, change: '+4%', changeType: 'increased' },
          { ticker: 'INSM', name: 'Insmed Inc', value: 349000, shares: 2400000, weight: 8.6, change: '+54%', changeType: 'increased' },
          { ticker: 'TEVA', name: 'Teva Pharma', value: 335000, shares: 17000000, weight: 8.3, change: '+25%', changeType: 'increased' },
          { ticker: 'TSM', name: 'Taiwan Semi', value: 214000, shares: 765000, weight: 5.3, change: '—', changeType: 'unchanged' },
          { ticker: 'WWD', name: 'Woodward', value: 160000, shares: 633000, weight: 3.9, change: '-25%', changeType: 'decreased' },
          { ticker: 'CPNG', name: 'Coupang', value: 149000, shares: 4600000, weight: 3.7, change: '+21%', changeType: 'increased' },
          { ticker: 'MELI', name: 'MercadoLibre', value: 136000, shares: 58000, weight: 3.4, change: '+3%', changeType: 'increased' },
          { ticker: 'DOCU', name: 'DocuSign', value: 122000, shares: 1700000, weight: 3.0, change: '+30%', changeType: 'increased' },
          { ticker: 'AMZN', name: 'Amazon', value: 96000, shares: 437000, weight: 2.4, change: 'NEW', changeType: 'new' },
          { ticker: 'META', name: 'Meta', value: 56000, shares: 76000, weight: 1.4, change: 'NEW', changeType: 'new' },
        ],
        newPositions: ['AMZN', 'META', 'GEV', 'VST', 'FIGR', 'STUB', 'CLF'],
        exitedPositions: ['MSFT', 'LLY', 'PM', 'WBD', 'AVGO', 'COHR'],
      },
      'Q2 2025': {
        totalValue: 4071255,
        totalPositions: 69,
        holdings: [
          { ticker: 'NTRA', name: 'Natera Inc', value: 520000, shares: 3170000, weight: 12.8, change: '+8%', changeType: 'increased' },
          { ticker: 'TEVA', name: 'Teva Pharma', value: 290000, shares: 13600000, weight: 7.1, change: '+15%', changeType: 'increased' },
          { ticker: 'INSM', name: 'Insmed Inc', value: 227000, shares: 1560000, weight: 5.6, change: '+20%', changeType: 'increased' },
          { ticker: 'WWD', name: 'Woodward', value: 214000, shares: 844000, weight: 5.3, change: '+5%', changeType: 'increased' },
          { ticker: 'TSM', name: 'Taiwan Semi', value: 200000, shares: 765000, weight: 4.9, change: '—', changeType: 'unchanged' },
          { ticker: 'CPNG', name: 'Coupang', value: 123000, shares: 3790000, weight: 3.0, change: '+12%', changeType: 'increased' },
          { ticker: 'MSFT', name: 'Microsoft', value: 100000, shares: 225000, weight: 2.5, change: '-30%', changeType: 'decreased' },
          { ticker: 'MELI', name: 'MercadoLibre', value: 132000, shares: 56000, weight: 3.2, change: '—', changeType: 'unchanged' },
        ],
        newPositions: ['FLUT', 'CZR', 'ROKU'],
        exitedPositions: ['NVDA', 'GOOGL'],
      },
      'Q1 2025': {
        totalValue: 3060048,
        totalPositions: 52,
        holdings: [
          { ticker: 'NTRA', name: 'Natera Inc', value: 480000, shares: 2930000, weight: 15.7, change: '+10%', changeType: 'increased' },
          { ticker: 'TEVA', name: 'Teva Pharma', value: 252000, shares: 11800000, weight: 8.2, change: '+18%', changeType: 'increased' },
          { ticker: 'CPNG', name: 'Coupang', value: 200000, shares: 3380000, weight: 6.5, change: '+5%', changeType: 'increased' },
          { ticker: 'WWD', name: 'Woodward', value: 204000, shares: 804000, weight: 6.7, change: '+3%', changeType: 'increased' },
          { ticker: 'TSM', name: 'Taiwan Semi', value: 185000, shares: 765000, weight: 6.0, change: '—', changeType: 'unchanged' },
          { ticker: 'INSM', name: 'Insmed Inc', value: 189000, shares: 1300000, weight: 6.2, change: '+25%', changeType: 'increased' },
          { ticker: 'MSFT', name: 'Microsoft', value: 143000, shares: 322000, weight: 4.7, change: '-15%', changeType: 'decreased' },
        ],
        newPositions: ['DOCU', 'ROKU', 'VRNA'],
        exitedPositions: ['GOOGL', 'BABA'],
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
        totalValue: 57982930,
        totalPositions: 3285,
        holdings: [
          { ticker: 'IWM', name: 'Russell 2000 (Put)', value: 8305000, shares: 34340900, weight: 14.3, change: '+60%', changeType: 'increased' },
          { ticker: 'IWM', name: 'Russell 2000 (Call)', value: 4152000, shares: 17170000, weight: 7.2, change: '+40%', changeType: 'increased' },
          { ticker: 'SPY', name: 'S&P 500 (Call)', value: 2218000, shares: 3333000, weight: 3.8, change: '+29K%', changeType: 'increased' },
          { ticker: 'QQQ', name: 'Nasdaq 100 (Put)', value: 1856000, shares: 3730000, weight: 3.2, change: '+7%', changeType: 'increased' },
          { ticker: 'QQQ', name: 'Nasdaq 100 (Call)', value: 1734000, shares: 3486000, weight: 3.0, change: 'NEW', changeType: 'new' },
          { ticker: 'SPY', name: 'S&P 500 ETF', value: 968000, shares: 1454000, weight: 1.7, change: '-27%', changeType: 'decreased' },
          { ticker: 'NVDA', name: 'NVIDIA', value: 220000, shares: 1810000, weight: 0.4, change: '+15%', changeType: 'increased' },
          { ticker: 'IBIT', name: 'Bitcoin ETF', value: 191000, shares: 3450000, weight: 0.3, change: '+400%', changeType: 'increased' },
          { ticker: 'MSFT', name: 'Microsoft', value: 189000, shares: 440000, weight: 0.3, change: '-5%', changeType: 'decreased' },
        ],
        newPositions: ['QQQ Call', 'XLU', 'XLE'],
        exitedPositions: ['PXD', 'SPLK'],
      },
      'Q2 2025': {
        totalValue: 45918919,
        totalPositions: 3177,
        holdings: [
          { ticker: 'IWM', name: 'Russell 2000 (Put)', value: 5190000, shares: 21463000, weight: 11.3, change: '+25%', changeType: 'increased' },
          { ticker: 'IWM', name: 'Russell 2000 (Call)', value: 2966000, shares: 12264000, weight: 6.5, change: '+20%', changeType: 'increased' },
          { ticker: 'QQQ', name: 'Nasdaq 100 (Put)', value: 1734000, shares: 3486000, weight: 3.8, change: '+10%', changeType: 'increased' },
          { ticker: 'SPY', name: 'S&P 500 ETF', value: 1324000, shares: 1990000, weight: 2.9, change: '+5%', changeType: 'increased' },
          { ticker: 'NVDA', name: 'NVIDIA', value: 191000, shares: 1574000, weight: 0.4, change: '+8%', changeType: 'increased' },
          { ticker: 'IBIT', name: 'Bitcoin ETF', value: 38000, shares: 690000, weight: 0.1, change: 'NEW', changeType: 'new' },
        ],
        newPositions: ['IBIT', 'FXI'],
        exitedPositions: ['SGEN', 'ATVI'],
      },
      'Q1 2025': {
        totalValue: 30095626,
        totalPositions: 2975,
        holdings: [
          { ticker: 'IWM', name: 'Russell 2000 (Put)', value: 4152000, shares: 17171000, weight: 13.8, change: '+15%', changeType: 'increased' },
          { ticker: 'IWM', name: 'Russell 2000 (Call)', value: 2472000, shares: 10220000, weight: 8.2, change: '+12%', changeType: 'increased' },
          { ticker: 'IWM', name: 'Russell 2000 ETF', value: 1500000, shares: 6200000, weight: 5.0, change: '—', changeType: 'unchanged' },
          { ticker: 'QQQ', name: 'Nasdaq 100 (Put)', value: 1576000, shares: 3169000, weight: 5.2, change: '+8%', changeType: 'increased' },
          { ticker: 'SPY', name: 'S&P 500 ETF', value: 1261000, shares: 1895000, weight: 4.2, change: '+3%', changeType: 'increased' },
        ],
        newPositions: ['XLE Put', 'EWZ Call'],
        exitedPositions: ['HZNP', 'COUP'],
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
        totalValue: 7383589,
        totalPositions: 45,
        holdings: [
          { ticker: 'BABA', name: 'Alibaba', value: 1153000, shares: 6450000, weight: 15.6, change: '-9%', changeType: 'decreased' },
          { ticker: 'AMZN', name: 'Amazon', value: 549000, shares: 2500000, weight: 7.4, change: '-7%', changeType: 'decreased' },
          { ticker: 'WHR', name: 'Whirlpool', value: 432000, shares: 3200000, weight: 5.9, change: '+1967%', changeType: 'increased' },
          { ticker: 'NVDA', name: 'NVIDIA', value: 354000, shares: 2920000, weight: 4.8, change: '+6x', changeType: 'increased' },
          { ticker: 'GOOG', name: 'Alphabet C', value: 338000, shares: 1500000, weight: 4.6, change: '-25%', changeType: 'decreased' },
          { ticker: 'META', name: 'Meta', value: 294000, shares: 400000, weight: 4.0, change: '-27%', changeType: 'decreased' },
          { ticker: 'AMD', name: 'AMD', value: 250000, shares: 1600000, weight: 3.4, change: 'NEW', changeType: 'new' },
          { ticker: 'QCOM', name: 'Qualcomm', value: 220000, shares: 1300000, weight: 3.0, change: '+256%', changeType: 'increased' },
        ],
        newPositions: ['AMD', 'FISV', 'UNH'],
        exitedPositions: ['AAPL Put', 'WYNN', 'LVS', 'AVGO'],
      },
      'Q2 2025': {
        totalValue: 6521000,
        totalPositions: 48,
        holdings: [
          { ticker: 'BABA', name: 'Alibaba', value: 1264000, shares: 7065000, weight: 19.4, change: '+5%', changeType: 'increased' },
          { ticker: 'AMZN', name: 'Amazon', value: 591000, shares: 2690000, weight: 9.1, change: '+3%', changeType: 'increased' },
          { ticker: 'NVDA', name: 'NVIDIA', value: 59000, shares: 487000, weight: 0.9, change: '-40%', changeType: 'decreased' },
          { ticker: 'GOOG', name: 'Alphabet C', value: 452000, shares: 2010000, weight: 6.9, change: '+8%', changeType: 'increased' },
          { ticker: 'META', name: 'Meta', value: 404000, shares: 550000, weight: 6.2, change: '+12%', changeType: 'increased' },
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
          { ticker: 'NVDA', name: 'NVIDIA', value: 98000, shares: 811000, weight: 1.7, change: '-20%', changeType: 'decreased' },
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
          { ticker: 'PLTR', name: 'Palantir (Put)', value: 912100, shares: 5000000, weight: 66.0, change: 'NEW', changeType: 'new' },
          { ticker: 'NVDA', name: 'NVIDIA (Put)', value: 186600, shares: 1000000, weight: 13.5, change: 'NEW', changeType: 'new' },
          { ticker: 'PFE', name: 'Pfizer (Call)', value: 152900, shares: 5500000, weight: 11.1, change: 'NEW', changeType: 'new' },
          { ticker: 'HAL', name: 'Halliburton (Call)', value: 61500, shares: 2000000, weight: 4.5, change: 'NEW', changeType: 'new' },
          { ticker: 'MOH', name: 'Molina Healthcare', value: 23900, shares: 125000, weight: 1.7, change: 'NEW', changeType: 'new' },
          { ticker: 'LULU', name: 'Lululemon', value: 17800, shares: 100000, weight: 1.3, change: '+100%', changeType: 'increased' },
          { ticker: 'SLM', name: 'SLM Corp', value: 13300, shares: 480000, weight: 1.0, change: 'NEW', changeType: 'new' },
        ],
        newPositions: ['PLTR Put', 'NVDA Put', 'PFE Call', 'HAL Call', 'MOH', 'SLM'],
        exitedPositions: ['UNH', 'REGN', 'META', 'EL', 'JD', 'BABA'],
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
        totalValue: 657149092,
        totalPositions: 12624,
        holdings: [
          { ticker: 'SPY', name: 'S&P 500 (Put)', value: 27300000, shares: 41000100, weight: 4.2, change: '+50%', changeType: 'increased' },
          { ticker: 'QQQ', name: 'Nasdaq 100 (Put)', value: 18600000, shares: 37400000, weight: 2.8, change: '+35%', changeType: 'increased' },
          { ticker: 'SPY', name: 'S&P 500 (Call)', value: 15200000, shares: 22800000, weight: 2.3, change: '+40%', changeType: 'increased' },
          { ticker: 'TSLA', name: 'Tesla (Call)', value: 9800000, shares: 38500000, weight: 1.5, change: '+279%', changeType: 'increased' },
          { ticker: 'QQQ', name: 'Nasdaq 100 (Call)', value: 8900000, shares: 17900000, weight: 1.4, change: '+25%', changeType: 'increased' },
          { ticker: 'MSFT', name: 'Microsoft', value: 2060000, shares: 4900000, weight: 0.3, change: '+100%', changeType: 'increased' },
          { ticker: 'NVDA', name: 'NVIDIA', value: 1830000, shares: 15100000, weight: 0.3, change: '+21%', changeType: 'increased' },
          { ticker: 'META', name: 'Meta', value: 1440000, shares: 1960000, weight: 0.2, change: '+12693%', changeType: 'increased' },
          { ticker: 'AAPL', name: 'Apple', value: 1250000, shares: 5500000, weight: 0.2, change: '+108%', changeType: 'increased' },
          { ticker: 'V', name: 'Visa', value: 1040000, shares: 3000000, weight: 0.2, change: '+14838%', changeType: 'increased' },
        ],
        newPositions: ['V', 'NSC', 'BKNG'],
        exitedPositions: ['HES', 'CVX'],
      },
      'Q2 2025': {
        totalValue: 550000000,
        totalPositions: 11800,
        holdings: [
          { ticker: 'SPY', name: 'S&P 500 (Put)', value: 18200000, shares: 27333000, weight: 3.3, change: '+20%', changeType: 'increased' },
          { ticker: 'QQQ', name: 'Nasdaq 100 (Put)', value: 13800000, shares: 27700000, weight: 2.5, change: '+18%', changeType: 'increased' },
          { ticker: 'SPY', name: 'S&P 500 (Call)', value: 10900000, shares: 16300000, weight: 2.0, change: '+15%', changeType: 'increased' },
          { ticker: 'NVDA', name: 'NVIDIA', value: 1510000, shares: 12500000, weight: 0.3, change: '+10%', changeType: 'increased' },
          { ticker: 'MSFT', name: 'Microsoft', value: 1030000, shares: 2450000, weight: 0.2, change: '+5%', changeType: 'increased' },
        ],
        newPositions: ['TSLA Call', 'GOOGL'],
        exitedPositions: ['SCHW'],
      },
      'Q1 2025': {
        totalValue: 480000000,
        totalPositions: 11200,
        holdings: [
          { ticker: 'SPY', name: 'S&P 500 (Put)', value: 15200000, shares: 22778000, weight: 3.2, change: '+12%', changeType: 'increased' },
          { ticker: 'QQQ', name: 'Nasdaq 100 (Put)', value: 11700000, shares: 23475000, weight: 2.4, change: '+10%', changeType: 'increased' },
          { ticker: 'SPY', name: 'S&P 500 (Call)', value: 9500000, shares: 14174000, weight: 2.0, change: '+8%', changeType: 'increased' },
          { ticker: 'NVDA', name: 'NVIDIA', value: 1370000, shares: 11363000, weight: 0.3, change: '+15%', changeType: 'increased' },
          { ticker: 'MSFT', name: 'Microsoft', value: 980000, shares: 2333000, weight: 0.2, change: '+3%', changeType: 'increased' },
        ],
        newPositions: ['COST', 'PANW'],
        exitedPositions: ['HES'],
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
          { ticker: 'FIGR', name: 'Figure Tech', value: 72000, shares: 2000000, weight: 1.0, change: 'NEW', changeType: 'new' },
        ],
        newPositions: ['RSP', 'FIGR', 'DIS', 'KODK'],
        exitedPositions: ['LBRDK', 'AER', 'BRO'],
      },
      'Q2 2025': {
        totalValue: 8650000,
        totalPositions: 197,
        holdings: [
          { ticker: 'AMZN', name: 'Amazon', value: 347000, shares: 1484000, weight: 4.0, change: '+12%', changeType: 'increased' },
          { ticker: 'SW', name: 'Smurfit WestRock', value: 421000, shares: 6944000, weight: 4.9, change: '+5%', changeType: 'increased' },
          { ticker: 'GOOGL', name: 'Alphabet A', value: 276000, shares: 1138000, weight: 3.2, change: '+3%', changeType: 'increased' },
          { ticker: 'GFL', name: 'GFL Environmental', value: 517000, shares: 9188000, weight: 6.0, change: '+20%', changeType: 'increased' },
          { ticker: 'LBRDK', name: 'Liberty Broadband', value: 220000, shares: 1440000, weight: 2.5, change: '—', changeType: 'unchanged' },
        ],
        newPositions: ['IWM', 'QQQ', 'TKO'],
        exitedPositions: ['ASTS', 'AFRM', 'AA'],
      },
      'Q1 2025': {
        totalValue: 7800000,
        totalPositions: 185,
        holdings: [
          { ticker: 'AMZN', name: 'Amazon', value: 310000, shares: 1325000, weight: 4.0, change: '+8%', changeType: 'increased' },
          { ticker: 'SW', name: 'Smurfit WestRock', value: 401000, shares: 6613000, weight: 5.1, change: '+10%', changeType: 'increased' },
          { ticker: 'GOOGL', name: 'Alphabet A', value: 268000, shares: 1105000, weight: 3.4, change: '+5%', changeType: 'increased' },
          { ticker: 'GFL', name: 'GFL Environmental', value: 431000, shares: 7657000, weight: 5.5, change: '+15%', changeType: 'increased' },
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
          { ticker: 'GOOGL', name: 'Alphabet A', value: 618000, shares: 2543300, weight: 19.1, change: '—', changeType: 'unchanged' },
          { ticker: 'PDD', name: 'PDD Holdings', value: 609000, shares: 5000000, weight: 18.9, change: '—', changeType: 'unchanged' },
          { ticker: 'GOOG', name: 'Alphabet C', value: 597000, shares: 2451300, weight: 18.5, change: '—', changeType: 'unchanged' },
          { ticker: 'BAC', name: 'Bank of America', value: 538000, shares: 13800000, weight: 16.7, change: '—', changeType: 'unchanged' },
          { ticker: 'BRK.B', name: 'Berkshire B', value: 451000, shares: 962600, weight: 14.0, change: '—', changeType: 'unchanged' },
          { ticker: 'EWBC', name: 'East West Bank', value: 220000, shares: 2775000, weight: 6.8, change: '—', changeType: 'unchanged' },
          { ticker: 'OXY', name: 'Occidental Petro', value: 60000, shares: 1466500, weight: 1.9, change: '—', changeType: 'unchanged' },
        ],
        newPositions: [],
        exitedPositions: [],
      },
      'Q2 2025': {
        totalValue: 2664000,
        totalPositions: 9,
        holdings: [
          { ticker: 'BAC', name: 'Bank of America', value: 489000, shares: 18034500, weight: 18.4, change: '-25%', changeType: 'decreased' },
          { ticker: 'PDD', name: 'PDD Holdings', value: 477000, shares: 5000000, weight: 17.9, change: 'NEW', changeType: 'new' },
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
          { ticker: 'BRK.B', name: 'Berkshire B', value: 453000, shares: 962600, weight: 15.7, change: '—', changeType: 'unchanged' },
          { ticker: 'GOOG', name: 'Alphabet C', value: 477000, shares: 3044000, weight: 16.6, change: '-19%', changeType: 'decreased' },
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

export default function Dashboard() {
  const [selectedInvestor, setSelectedInvestor] = useState(INVESTORS[0]);
  const [selectedQuarter, setSelectedQuarter] = useState('Q3 2025');
  const [searchTerm, setSearchTerm] = useState('');

  const quarterData = selectedInvestor.quarters[selectedQuarter];
  const filteredHoldings = quarterData?.holdings.filter(h =>
    h.ticker.toLowerCase().includes(searchTerm.toLowerCase()) ||
    h.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

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
      case 'new': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'increased': return 'bg-green-50 text-green-700 border-green-200';
      case 'decreased': return 'bg-red-50 text-red-700 border-red-200';
      case 'exit': return 'bg-gray-100 text-gray-500 border-gray-200';
      default: return 'bg-gray-50 text-gray-500 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Header */}
      <header className="border-b border-gray-200 sticky top-0 bg-white z-50">
        <div className="max-w-7xl mx-auto px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="font-bold text-lg">13F</span>
              <span className="text-gray-400 text-sm">Legendary Investors</span>
            </div>
            {/* Quarter Selector */}
            <div className="flex gap-1">
              {QUARTERS.map(q => (
                <button
                  key={q}
                  onClick={() => setSelectedQuarter(q)}
                  className={`px-3 py-1 text-xs font-medium rounded transition ${
                    selectedQuarter === q
                      ? 'bg-gray-900 text-white'
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
        <div className="flex gap-1 overflow-x-auto pb-3 mb-3 border-b border-gray-100">
          {INVESTORS.map(inv => (
            <button
              key={inv.id}
              onClick={() => setSelectedInvestor(inv)}
              className={`px-3 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition ${
                selectedInvestor.id === inv.id
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              {inv.name.split(' ')[1]}
            </button>
          ))}
        </div>

        {/* Investor Info */}
        <div className="flex justify-between items-start mb-3">
          <div>
            <h1 className="text-lg font-bold">{selectedInvestor.name}</h1>
            <p className="text-xs text-gray-500">
              {selectedInvestor.fund} · {selectedInvestor.location} · <span className="text-blue-600">{selectedInvestor.style}</span>
            </p>
          </div>
          <div className="text-right">
            <p className="text-xl font-bold">{formatValue(quarterData?.totalValue || 0)}</p>
            <p className="text-xs text-gray-500">{quarterData?.totalPositions || 0} positions</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-2 mb-3">
          <div className="bg-gray-50 rounded p-2">
            <p className="text-[10px] text-gray-500 uppercase">Total Value</p>
            <p className="font-bold text-sm">{formatValue(quarterData?.totalValue || 0)}</p>
          </div>
          <div className="bg-gray-50 rounded p-2">
            <p className="text-[10px] text-gray-500 uppercase">Positions</p>
            <p className="font-bold text-sm">{quarterData?.totalPositions || 0}</p>
          </div>
          <div className="bg-green-50 rounded p-2">
            <p className="text-[10px] text-green-700 uppercase">New</p>
            <p className="font-bold text-sm text-green-700">{quarterData?.newPositions.length || 0}</p>
          </div>
          <div className="bg-red-50 rounded p-2">
            <p className="text-[10px] text-red-700 uppercase">Exited</p>
            <p className="font-bold text-sm text-red-700">{quarterData?.exitedPositions.length || 0}</p>
          </div>
        </div>

        {/* Activity */}
        {(quarterData?.newPositions.length > 0 || quarterData?.exitedPositions.length > 0) && (
          <div className="grid grid-cols-2 gap-2 mb-3">
            {quarterData.newPositions.length > 0 && (
              <div className="bg-green-50 border border-green-200 rounded p-2">
                <p className="text-[10px] font-medium text-green-700 mb-1">NEW</p>
                <p className="text-xs text-green-800">{quarterData.newPositions.join(', ')}</p>
              </div>
            )}
            {quarterData.exitedPositions.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded p-2">
                <p className="text-[10px] font-medium text-red-700 mb-1">EXITED</p>
                <p className="text-xs text-red-800">{quarterData.exitedPositions.join(', ')}</p>
              </div>
            )}
          </div>
        )}

        {/* Search */}
        <input
          type="text"
          placeholder="Search ticker or company..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full border border-gray-200 rounded px-3 py-1.5 text-sm mb-3 focus:outline-none focus:ring-1 focus:ring-gray-300"
        />

        {/* Table */}
        <div className="border border-gray-200 rounded overflow-hidden">
          <table className="w-full text-xs">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-2 px-2 font-medium text-gray-600 w-8">#</th>
                <th className="text-left py-2 px-2 font-medium text-gray-600">Ticker</th>
                <th className="text-left py-2 px-2 font-medium text-gray-600">Company</th>
                <th className="text-left py-2 px-2 font-medium text-gray-600">Description</th>
                <th className="text-right py-2 px-2 font-medium text-gray-600">Mkt Cap</th>
                <th className="text-right py-2 px-2 font-medium text-gray-600">Value</th>
                <th className="text-right py-2 px-2 font-medium text-gray-600">Shares</th>
                <th className="text-right py-2 px-2 font-medium text-gray-600">Weight</th>
                <th className="text-center py-2 px-2 font-medium text-gray-600">Chg</th>
              </tr>
            </thead>
            <tbody>
              {filteredHoldings.map((h, idx) => {
                const info = getStockInfo(h.ticker);
                return (
                  <tr key={`${h.ticker}-${idx}`} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="py-1.5 px-2 text-gray-400">{idx + 1}</td>
                    <td className="py-1.5 px-2 font-mono font-semibold">{h.ticker}</td>
                    <td className="py-1.5 px-2 text-gray-700">{h.name}</td>
                    <td className="py-1.5 px-2 text-gray-500 text-[10px]">{info.desc}</td>
                    <td className="py-1.5 px-2 text-right text-gray-500 font-mono text-[10px]">{info.marketCap}</td>
                    <td className="py-1.5 px-2 text-right font-mono">{formatValue(h.value)}</td>
                    <td className="py-1.5 px-2 text-right font-mono text-gray-500">{formatShares(h.shares)}</td>
                    <td className="py-1.5 px-2 text-right">
                      <span className="font-mono">{h.weight}%</span>
                    </td>
                    <td className="py-1.5 px-2 text-center">
                      <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-medium border ${getChangeColor(h.changeType)}`}>
                        {h.change}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <footer className="mt-4 pt-3 border-t border-gray-100 text-center">
          <p className="text-[10px] text-gray-400">
            Data from SEC 13F filings · {selectedQuarter} · Not financial advice
          </p>
        </footer>
      </div>
    </div>
  );
}
