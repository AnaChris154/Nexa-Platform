import { NextResponse } from 'next/server';
import { pedagogiaService } from '@/services/pedagogiaService';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = await pedagogiaService.registrarResposta(body);
    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
