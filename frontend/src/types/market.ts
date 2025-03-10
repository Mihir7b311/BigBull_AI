import { Time } from 'lightweight-charts';

export interface MarketData {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface ChartData {
  time: Time;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
}

export interface AIMessage {
  id: string;
  role: 'assistant' | 'user';
  content: string;
  timestamp: Date;
  type: 'ANALYSIS' | 'SIGNAL' | 'TRADE' | 'INFO';
  metadata?: {
    price?: number;
    action?: 'BUY' | 'SELL';
    confidence?: number;
    reason?: string;
  };
} 