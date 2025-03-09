'use client'

import { Box, Grid, GridItem } from '@chakra-ui/react'
import LeftSidebar from '@/components/LeftSidebar'
import RightSidebar from '@/components/RightSidebar'
import ChatInterface from '@/components/ChatInterface'

export default function Home() {
  return (
    <Box h="calc(100vh - 4rem)" position="fixed" top="4rem" left="0" right="0" bottom="0">
      <Grid
        templateColumns="320px 1fr 320px"
        h="full"
        gap={0}
      >
        <GridItem>
          <LeftSidebar />
        </GridItem>
        <GridItem bg="gray.900">
          <ChatInterface />
        </GridItem>
        <GridItem>
          <RightSidebar />
        </GridItem>
      </Grid>
    </Box>
  )
}
