"use client";

import { supabaseClient } from "@/lib/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { ICatalog, ICatalogWithRelations, defaultCatalog } from "../../lib/types/catalog";

export function useCatalog(filters?: Record<string, any>) {
    return useQuery({
        queryKey: ["catalog", filters],
        queryFn: async () => {
            const supabase = supabaseClient();

            let query = supabase
                .from("catalog")
                .select(`
          *,
          brand:brands(*),
          character:characters(*, series:series(*))
        `);

            console.log("Filters:", filters);

            // Apply filters if provided
            if (filters) {
                Object.entries(filters).forEach(([key, value]) => {
                    if (value !== undefined && value !== null && value !== '') {
                        if (key === 'search') {
                            query = query.ilike('name', `%${value}%`);
                        } else if (key === 'brand') {
                            query = query.eq('brand_id', value);
                        } else if (key === 'character') {
                            query = query.eq('character_id', value);
                        } else if (key === 'catalog_type') {
                            query = query.eq('catalog_type', value);
                        } else if (key === 'status') {
                            query = query.eq('status', value);
                        } else if (key === 'size') {
                            query = query.eq('size', value);
                        } else if (key === 'gender') {
                            query = query.eq('gender', value);
                        } else if (key === 'minPrice') {
                            query = query.gte('price', value);
                        } else if (key === 'maxPrice') {
                            query = query.lte('price', value);
                        }
                    }
                });
            }

            const { data: catalogs } = await query.order('created_at', { ascending: false });
            console.log("Catalogs:", catalogs);

            // Apply nested filters in JavaScript since they can't be filtered in Supabase query
            let filteredCatalogs = catalogs || [];

            if (filters?.category) {
                filteredCatalogs = filteredCatalogs.filter((catalog: any) =>
                    catalog.character?.series?.category === filters.category
                );
            }

            if (filters?.series) {
                filteredCatalogs = filteredCatalogs.filter((catalog: any) =>
                    catalog.character?.series?.id === filters.series
                );
            }

            return filteredCatalogs as ICatalogWithRelations[];
        },
    });
}

export function useCatalogById(id?: string) {
    return useQuery({
        queryKey: ["catalog", id],
        queryFn: async () => {
            if (!id) return null;

            const supabase = supabaseClient();
            const { data: catalog } = await supabase
                .from("catalog")
                .select(`
          *,
          brand:brands(*),
          character:characters(*, series:series(*))
        `)
                .eq("id", id)
                .single();

            return catalog ? Object.assign({}, defaultCatalog, catalog) as ICatalogWithRelations : null;
        },
        enabled: !!id,
    });
}

export function useCatalogBySlug(slug?: string) {
    return useQuery({
        queryKey: ["catalog", "slug", slug],
        queryFn: async () => {
            if (!slug) return null;

            const supabase = supabaseClient();
            const { data: catalog } = await supabase
                .from("catalog")
                .select(`
          *,
          brand:brands(*),
          character:characters(*, series:series(*))
        `)
                .eq("slug", slug)
                .single();

            return catalog ? Object.assign({}, defaultCatalog, catalog) as ICatalogWithRelations : null;
        },
        enabled: !!slug,
    });
}

export function useAllCatalogs() {
    return useQuery({
        queryKey: ["catalog", "all"],
        queryFn: async () => {
            const supabase = supabaseClient();
            const { data: catalogs } = await supabase
                .from("catalog")
                .select(`
          *,
          brand:brands(*),
          character:characters(*, series:series(*))
        `)
                .order('created_at', { ascending: false });

            return catalogs as ICatalogWithRelations[];
        },
    });
}
