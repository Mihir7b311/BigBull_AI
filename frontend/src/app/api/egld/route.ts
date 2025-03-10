import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'src/data/egld.csv');
    const fileContent = fs.readFileSync(filePath, 'utf8');
    
    return new NextResponse(fileContent, {
      headers: {
        'Content-Type': 'text/csv',
      },
    });
  } catch (error) {
    console.error('Error reading CSV file:', error);
    return new NextResponse(JSON.stringify({ error: 'Failed to read CSV data' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
