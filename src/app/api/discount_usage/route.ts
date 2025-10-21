import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id') || "";
    const discount = searchParams.get('discount') || "";
    const user = searchParams.get('user') || "";

    if (id.trim()) {
        const data = await xata.db.discount_usage.read(id);
        if (!data) {
            return NextResponse.json({ error: 'Discount usage not found' }, { status: 404 });
        }
        return NextResponse.json(data);
    }

    if (user.trim() && discount.trim()) {
        const data = await xata.db.discount_usage
            .filter({ user, discount })
            .getAll();
        return NextResponse.json(data);
    }

    if (discount.trim()) {
        const data = await xata.db.discount_usage
            .filter({ discount })
            .getAll();
        return NextResponse.json(data);
    }

    const data = await xata.db.discount_usage.getAll();
    return NextResponse.json(data);
}

export async function POST(request: Request) {
    const model = await request.json();
    const data = await xata.db.discount_usage.createOrUpdate(model);
    return NextResponse.json(data);
}

export async function DELETE(request: Request) {
    const { id } = await request.json();
    const data = await xata.db.discount_usage.delete(id);
    return NextResponse.json(data);
}
