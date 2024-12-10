import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const schemaUid = searchParams.get('schemaUid');
  const page = searchParams.get('page');
  const pageSize = searchParams.get('pageSize');

  try {
    const response = await fetch(
      `https://testnet.bascan.io/api/schema/attestation?schemaUid=${schemaUid}&page=${page}&pageSize=${pageSize}`
    );
    
    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}
