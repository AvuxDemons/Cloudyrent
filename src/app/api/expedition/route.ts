import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { presetPagination } from '../../../lib/types/pagination';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id') || "";
    const search = searchParams.get('search') || "";
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');

    // Validate pageSize is one of the allowed values
    const allowedPageSizes = presetPagination.map(p => parseInt(p.key));
    const validatedPageSize = allowedPageSizes.includes(pageSize) ? pageSize : 10;

    // Handle single expedition request
    if (id.trim()) {
        const data = await xata.db.expedition.read(id);
        if (!data) {
            return NextResponse.json({ error: 'Expedition not found' }, { status: 404 });
        }
        return NextResponse.json(data);
    }

    // Get all expeditions and convert to regular array
    const allExpeditions = await xata.db.expedition
        .select(["*"])
        .order('created_at', { ascending: false })
        .getAll();
    const expeditionsArray = JSON.parse(JSON.stringify(allExpeditions));

    // Apply search filter if provided (case-insensitive)
    let filteredExpeditions = expeditionsArray;
    if (search.trim()) {
        const searchLower = search.toLowerCase();
        filteredExpeditions = expeditionsArray.filter((expedition: any) =>
            expedition.name?.toLowerCase().includes(searchLower) ||
            expedition.code?.toLowerCase().includes(searchLower)
        );
    }

    // Calculate pagination
    const totalItems = filteredExpeditions.length;
    const totalPages = Math.ceil(totalItems / validatedPageSize);
    const currentPage = Math.max(1, Math.min(page, totalPages || 1));
    const startIndex = (currentPage - 1) * validatedPageSize;
    const endIndex = Math.min(startIndex + validatedPageSize, totalItems);

    // Get paginated results
    const paginatedExpeditions = filteredExpeditions.slice(startIndex, endIndex);

    return NextResponse.json({
        status: 200,
        message: 'Expeditions fetched successfully',
        data: paginatedExpeditions,
        pagination: {
            currentPage,
            pageSize: validatedPageSize,
            totalItems,
            totalPages,
            hasNextPage: currentPage < totalPages,
            hasPrevPage: currentPage > 1
        }
    });
}