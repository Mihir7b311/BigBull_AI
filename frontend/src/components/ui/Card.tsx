'use client'

import { Box, BoxProps } from '@chakra-ui/react'
import { motion } from 'framer-motion'

interface CardProps extends BoxProps {
  delay?: number
}

const MotionBox = motion(Box)

export const Card = ({ children, delay = 0, ...props }: CardProps) => {
  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out, border-color 0.3s ease-in-out',
      }}
      bg="brand.dark.100"
      backdropFilter="blur(20px) saturate(180%)"
      borderRadius="2xl"
      border="1px solid"
      borderColor="whiteAlpha.100"
      p={6}
      position="relative"
      overflow="hidden"
      boxShadow="0 8px 32px 0 rgba(0, 0, 0, 0.37)"
      _before={{
        content: '""',
        position: 'absolute',
        top: 0,
        left: '-50%',
        width: '200%',
        height: '100%',
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
        transform: 'translateX(-100%)',
        transition: 'transform 0.5s ease',
      }}
      _hover={{
        transform: 'translateY(-2px)',
        boxShadow: '0 12px 40px 0 rgba(0, 0, 0, 0.5)',
        borderColor: 'whiteAlpha.200',
        _before: {
          transform: 'translateX(100%)',
        },
      }}
      {...props}
    >
      {children}
    </MotionBox>
  )
} 