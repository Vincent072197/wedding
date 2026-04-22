import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Define the path to our local JSON file
const dataFilePath = path.join(process.cwd(), 'data', 'config.json');

export async function GET() {
  try {
    const fileData = fs.readFileSync(dataFilePath, 'utf8');
    const config = JSON.parse(fileData);
    return NextResponse.json(config);
  } catch (error) {
    console.error('Error reading config:', error);
    return NextResponse.json({ error: 'Failed to read configuration' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const newConfig = await request.json();
    
    // In a real app, we would validate the input data here
    
    fs.writeFileSync(dataFilePath, JSON.stringify(newConfig, null, 2), 'utf8');
    return NextResponse.json({ success: true, message: 'Configuration saved successfully' });
  } catch (error) {
    console.error('Error writing config:', error);
    return NextResponse.json({ error: 'Failed to save configuration' }, { status: 500 });
  }
}
