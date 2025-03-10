'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { createChart, ColorType, CrosshairMode, SeriesMarkerShape, IChartApi, ISeriesApi } from 'lightweight-charts';
import { Box, VStack, HStack, Icon, Text, Badge, Button, useToast } from '@chakra-ui/react';
import { TrendingUp, TrendingDown, Activity, DollarSign, Bell } from 'lucide-react';

interface Trade {
  type: 'BUY' | 'SELL';
  price: number;
  time: string;
  timestamp: number;
}

interface TradeData {
  timestamp: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface TradingViewProps {
  currentTrade: TradeData | null;
  isSimulating: boolean;
  tradeData: TradeData[];
}

const TradingView = ({ currentTrade, isSimulating, tradeData }: TradingViewProps) => {
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const chartRef = useRef<IChartApi | null>(null);
    const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
    const toast = useToast();

    const [tradeSignals, setTradeSignals] = useState<Trade[]>([]);
    
    // Initialize the chart
    useEffect(() => {
        if (!chartContainerRef.current) return;
        
        // Clean up previous chart if exists
        if (chartRef.current) {
            chartRef.current.remove();
        }

        const chart = createChart(chartContainerRef.current, {
            layout: {
                background: { type: ColorType.Solid, color: 'rgba(20, 22, 34, 1)' },
                textColor: 'white',
            },
            grid: {
                vertLines: { color: 'rgba(255, 255, 255, 0.1)' },
                horzLines: { color: 'rgba(255, 255, 255, 0.1)' },
            },
            crosshair: { mode: CrosshairMode.Normal },
            rightPriceScale: { borderColor: 'rgba(255, 255, 255, 0.1)' },
            timeScale: { 
                borderColor: 'rgba(255, 255, 255, 0.1)',
                timeVisible: true,
                secondsVisible: false,
            },
            width: chartContainerRef.current.clientWidth,
            height: chartContainerRef.current.clientHeight,
        });

        const candlestickSeries = chart.addCandlestickSeries({
            upColor: '#22c55e',
            downColor: '#ef4444',
            borderVisible: false,
            wickUpColor: '#22c55e',
            wickDownColor: '#ef4444',
        });

        chartRef.current = chart;
        seriesRef.current = candlestickSeries;

        const handleResize = () => {
            if (chartRef.current && chartContainerRef.current) {
                chartRef.current.applyOptions({ 
                    width: chartContainerRef.current.clientWidth,
                    height: chartContainerRef.current.clientHeight 
                });
            }
        };
        
        window.addEventListener('resize', handleResize);
        
        return () => {
            window.removeEventListener('resize', handleResize);
            chart.remove();
        };
    }, []);

    // Update chart data when tradeData changes
    useEffect(() => {
        if (!seriesRef.current || tradeData.length === 0) return;

        const formattedData = tradeData.map(trade => {
            // Extract timestamp components
            const timestamp = new Date(trade.timestamp).getTime() / 1000;
            return {
                time: timestamp,
                open: trade.open,
                high: trade.high,
                low: trade.low,
                close: trade.close,
            };
        });

        // Convert timestamps to UTC string format for the chart
        const formattedDataWithUTC = formattedData.map(d => ({
            ...d,
            time: new Date(d.time * 1000).toISOString().split('T')[0]
        }));

        seriesRef.current.setData(formattedDataWithUTC);
        
        // Update chart markers for trades
        if (tradeSignals.length > 0) {
            const markers = tradeSignals.map(trade => ({
                time: trade.timestamp,
                position: trade.type === 'BUY' ? 'belowBar' : 'aboveBar',
                color: trade.type === 'BUY' ? '#22c55e' : '#ef4444',
                shape: SeriesMarkerShape.Circle,
                text: trade.type,
            }));
            seriesRef.current.setMarkers(markers);
        }
        
    }, [tradeData, tradeSignals]);

    // Auto-fit chart when data changes
    useEffect(() => {
        if (chartRef.current && tradeData.length > 0) {
            chartRef.current.timeScale().fitContent();
        }
    }, [tradeData.length]);

    // AI Trading logic
    useEffect(() => {
        if (!isSimulating || !currentTrade) return;
        
        // Only trigger the AI decision-making occasionally
        const shouldMakeDecision = Math.random() > 0.7; // 30% chance of making a decision
        
        if (shouldMakeDecision) {
            // Simple AI logic based on price movement
            const previousTrade = tradeData[tradeData.length - 2];
            
            if (previousTrade && currentTrade) {
                // Calculate price change direction
                const priceIncreasing = currentTrade.close > previousTrade.close;
                const priceDecreasing = currentTrade.close < previousTrade.close;
                
                // Make trading decision
                if (priceIncreasing && Math.random() > 0.4) {
                    executeTrade('BUY');
                } else if (priceDecreasing && Math.random() > 0.4) {
                    executeTrade('SELL');
                }
            }
        }
    }, [currentTrade, isSimulating]);

    const executeTrade = useCallback((type: 'BUY' | 'SELL') => {
        if (!currentTrade) return;

        const newTrade: Trade = {
            type,
            price: currentTrade.close,
            time: currentTrade.timestamp,
            timestamp: new Date(currentTrade.timestamp).getTime() / 1000,
        };
        
        setTradeSignals((prev) => [...prev, newTrade]);

        // Show trade notification
        toast({
            title: `AI Executed ${type} Trade`,
            description: `Price: $${currentTrade.close.toFixed(4)}`,
            status: type === 'BUY' ? 'success' : 'error',
            duration: 3000,
            isClosable: true,
            position: "top-right",
        });
    }, [currentTrade, toast]);

    if (!currentTrade) {
        return <Box>Loading chart data...</Box>;
    }

    return (
        <Box h="full" p={4}>
            <VStack spacing={4} align="stretch" h="full">
                <HStack justify="space-between" bg="whiteAlpha.100" p={3} rounded="lg">
                    <HStack>
                        <Icon as={DollarSign} />
                        <Text>Current Price: ${currentTrade.close.toFixed(4)}</Text>
                    </HStack>
                    
                    <Badge colorScheme={currentTrade.close > currentTrade.open ? 'green' : 'red'}>
                        {currentTrade.close > currentTrade.open ? 'BULLISH' : 'BEARISH'}
                    </Badge>
                </HStack>
                
                <Box ref={chartContainerRef} flex="1" w="100%" minH="300px" />
                
                <HStack>
                    <Button 
                        colorScheme="green" 
                        leftIcon={<Icon as={TrendingUp} />} 
                        onClick={() => executeTrade('BUY')}
                        isDisabled={!isSimulating}
                    >
                        Buy
                    </Button>
                    <Button 
                        colorScheme="red" 
                        leftIcon={<Icon as={TrendingDown} />} 
                        onClick={() => executeTrade('SELL')}
                        isDisabled={!isSimulating}
                    >
                        Sell
                    </Button>
                </HStack>
                
                <Box bg="whiteAlpha.100" p={3} rounded="lg">
                    <HStack justify="space-between">
                        <Text>Trade Signals</Text>
                        <Text>{tradeSignals.length} signals</Text>
                    </HStack>
                </Box>
            </VStack>
        </Box>
    );
};

export default TradingView;
