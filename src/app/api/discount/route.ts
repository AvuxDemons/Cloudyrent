import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id') || "";
    const code = searchParams.get('code') || "";

    if (id.trim()) {
        const data = await xata.db.discount.read(id);
        if (!data) {
            return NextResponse.json({ error: 'Discount not found' }, { status: 404 });
        }
        return NextResponse.json(data);
    }

    if (code.trim()) {
        const data = await xata.db.discount.filter({ code }).getFirst();
        return NextResponse.json(data);
    }

    const data = await xata.db.discount.select(["*", "catalog.*"]).getAll();
    return NextResponse.json(data);
}

export async function POST(request: Request) {
    const model = await request.json();
    const data = await xata.db.discount.createOrUpdate(model);
    return NextResponse.json(data);
}

export async function DELETE(request: Request) {
    const { id } = await request.json();
    const data = await xata.db.discount.delete(id);
    return NextResponse.json(data);
}
