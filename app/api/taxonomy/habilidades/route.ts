import { NextResponse } from 'next/server';
import { pedagogiaService } from '@/services/pedagogiaService';

export async function GET() {
  try {
    const habilidades = await pedagogiaService.getHabilidades();
    return NextResponse.json(habilidades);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
