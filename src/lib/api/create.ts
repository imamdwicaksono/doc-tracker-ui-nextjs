import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const data = await request.json()
  console.log('Received tracker:', data)
  return NextResponse.json({ message: 'Tracker created', data })
}