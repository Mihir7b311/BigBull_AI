'use client'

import { useEffect, useRef } from 'react'
import { createChart, ColorType, CrosshairMode } from 'lightweight-charts'
import type { IChartApi, DeepPartial, ChartOptions, CandlestickData } from 'lightweight-charts'
import { Box } from '@chakra-ui/react'

interface ChartProps {
  data: CandlestickData[]
  height?: number
}

export default function Chart({ data, height = 400 }: ChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null)
  const chart = useRef<IChartApi | null>(null)

  useEffect(() => {
    if (!chartContainerRef.current) return

    const chartOptions: DeepPartial<ChartOptions> = {
      layout: {
        background: { color: 'rgba(17, 24, 39, 0)' },
        textColor: '#d1d5db',
      },
      grid: {
        vertLines: { color: 'rgba(255, 255, 255, 0.1)' },
        horzLines: { color: 'rgba(255, 255, 255, 0.1)' },
      },
      crosshair: {
        mode: CrosshairMode.Normal,
      },
      rightPriceScale: {
        borderColor: 'rgba(255, 255, 255, 0.1)',
      },
      timeScale: {
        borderColor: 'rgba(255, 255, 255, 0.1)',
        timeVisible: true,
        secondsVisible: true,
      },
      handleScroll: {
        mouseWheel: true,
        pressedMouseMove: true,
      },
      handleScale: {
        axisPressedMouseMove: true,
        mouseWheel: true,
        pinch: true,
      },
    }

    chart.current = createChart(chartContainerRef.current, {
      ...chartOptions,
      width: chartContainerRef.current.clientWidth,
      height,
    })

    const candlestickSeries = chart.current.addCandlestickSeries({
      upColor: '#22c55e',
      downColor: '#ef4444',
      borderVisible: false,
      wickUpColor: '#22c55e',
      wickDownColor: '#ef4444',
    })

    candlestickSeries.setData(data)

    // Add EMA indicators
    const ema20Series = chart.current.addLineSeries({
      color: '#3b82f6',
      lineWidth: 1,
      title: 'EMA 20',
    })

    const ema50Series = chart.current.addLineSeries({
      color: '#8b5cf6',
      lineWidth: 1,
      title: 'EMA 50',
    })

    // Calculate EMAs
    const ema20Data = calculateEMA(data, 20)
    const ema50Data = calculateEMA(data, 50)

    ema20Series.setData(ema20Data)
    ema50Series.setData(ema50Data)

    // Resize handler
    const handleResize = () => {
      if (chart.current && chartContainerRef.current) {
        chart.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
        })
      }
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      if (chart.current) {
        chart.current.remove()
      }
    }
  }, [data, height])

  return (
    <Box 
      ref={chartContainerRef} 
      w="full" 
      h={`${height}px`}
      position="relative"
    />
  )
}

// Helper function to calculate EMA
function calculateEMA(data: CandlestickData[], period: number) {
  const k = 2 / (period + 1)
  let ema = data[0].close
  
  return data.map(candle => {
    ema = (candle.close - ema) * k + ema
    return {
      time: candle.time,
      value: ema,
    }
  })
} 