'use client'

import { useEffect, useRef, memo, useState } from 'react'
import { Box, Skeleton } from '@chakra-ui/react'

let tvScriptLoadingPromise: Promise<void> | null = null

interface TradingViewWidgetProps {
  symbol: string
}

function TradingViewWidget({ symbol }: TradingViewWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const initWidget = async () => {
      if (!tvScriptLoadingPromise) {
        tvScriptLoadingPromise = new Promise((resolve) => {
          const script = document.createElement('script')
          script.id = 'tradingview-widget-loading-script'
          script.src = 'https://s3.tradingview.com/tv.js'
          script.type = 'text/javascript'
          script.onload = resolve as () => void
          document.head.appendChild(script)
        })
      }

      try {
        await tvScriptLoadingPromise
        
        if (containerRef.current && 'TradingView' in window) {
          const widget = new (window as any).TradingView.widget({
            autosize: true,
            symbol: `BINANCE:${symbol}`,
            interval: '1',
            timezone: 'Etc/UTC',
            theme: 'dark',
            style: '1',
            locale: 'en',
            enable_publishing: false,
            allow_symbol_change: true,
            container: containerRef.current,
            hide_side_toolbar: false,
            studies: [
              'MASimple@tv-basicstudies',
              'RSI@tv-basicstudies',
              'MACD@tv-basicstudies'
            ],
            toolbar_bg: '#1A202C',
            loading_screen: { backgroundColor: "#1A202C" },
            overrides: {
              "mainSeriesProperties.candleStyle.upColor": "#48BB78",
              "mainSeriesProperties.candleStyle.downColor": "#F56565",
              "mainSeriesProperties.candleStyle.wickUpColor": "#48BB78",
              "mainSeriesProperties.candleStyle.wickDownColor": "#F56565"
            }
          })

          widget.onChartReady(() => {
            setIsLoading(false)
          })
        }
      } catch (error) {
        console.error('Error initializing TradingView widget:', error)
        setIsLoading(false)
      }
    }

    initWidget()

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = ''
      }
    }
  }, [symbol])

  return (
    <Box position="relative" h="full" w="full">
      <Skeleton
        isLoaded={!isLoading}
        h="full"
        w="full"
        startColor="gray.800"
        endColor="gray.700"
      >
        <Box
          ref={containerRef}
          h="full"
          w="full"
          bg="gray.800"
          rounded="lg"
          overflow="hidden"
        />
      </Skeleton>
    </Box>
  )
}

export default memo(TradingViewWidget) 