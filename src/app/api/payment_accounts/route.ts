import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id') || "";

    if (id.trim()) {
        const data = await xata.db.payment_accounts.read(id);
        if (!data) {
            return NextResponse.json({ error: 'Payment account not found' }, { status: 404 });
        }
        return NextResponse.json(data);
    }

    const data = await xata.db.payment_accounts.getAll();
    return NextResponse.json(data);
}

export async function POST(request: Request) {
    const model = await request.json();
    const data = await xata.db.payment_accounts.createOrUpdate(model);
    return NextResponse.json(data);
}

export async function DELETE(request: Request) {
    const { id } = await request.json();
    const data = await xata.db.payment_accounts.delete(id);
    return NextResponse.json(data);
}
