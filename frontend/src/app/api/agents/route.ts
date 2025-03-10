import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const agents = await prisma.agent.findMany({
      include: {
        strategy: true,
        performance: true,
      },
    })
    return NextResponse.json(agents)
  } catch (error) {
    console.error('Failed to fetch agents:', error)
    return NextResponse.json(
      { error: 'Failed to fetch agents' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name } = body

    // Get or create a default user
    let defaultUser = await prisma.user.findFirst({
      where: {
        email: 'default@BigBullai.com'
      }
    })

    if (!defaultUser) {
      defaultUser = await prisma.user.create({
        data: {
          email: 'default@BigBullai.com',
          name: 'Default User'
        }
      })
    }

    const agent = await prisma.agent.create({
      data: {
        name,
        userId: defaultUser.id,
        status: 'UNFUNDED',
        balance: 0,
      },
      include: {
        strategy: true,
        performance: true,
      },
    })

    return NextResponse.json(agent)
  } catch (error) {
    console.error('Failed to create agent:', error)
    return NextResponse.json(
      { error: 'Failed to create agent' },
      { status: 500 }
    )
  }
} 