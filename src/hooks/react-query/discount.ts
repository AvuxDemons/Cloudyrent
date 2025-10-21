"use client";

import { supabaseClient } from "@/lib/supabase/client";
import { useQuery } from "@tanstack/react-query";

interface IDiscount {
    id?: string;
    code: string;
    amount: number;
    catalog: any;
    limit: number;
    is_per_user: boolean;
    created_at?: string;
    updated_at?: string;
}

const defaultDiscount: IDiscount = {
    code: "",
    amount: 0,
    catalog: null,
    limit: 0,
    is_per_user: false,
};

export function useDiscount(filters?: Record<string, any>) {
    return useQuery({
        queryKey: ["discounts", filters],
        queryFn: async () => {
            const supabase = supabaseClient();

            let query = supabase
                .from("discounts")
                .select("*");

            // Apply filters if provided
            if (filters) {
                Object.entries(filters).forEach(([key, value]) => {
                    if (value !== undefined && value !== null && value !== '') {
                        if (key === 'search') {
                            query = query.ilike('name', `%${value}%`);
                        } else if (key === 'status') {
                            query = query.eq('status', value);
                        }
                    }
                });
            }

            const { data: discounts } = await query.order('created_at', { ascending: false });

            return discounts as IDiscount[];
        },
    });
}

export function useDiscountById(id?: string) {
    return useQuery({
        queryKey: ["discounts", id],
        queryFn: async () => {
            if (!id) return null;

            const supabase = supabaseClient();
            const { data: discount } = await supabase
                .from("discounts")
                .select("*")
                .eq("id", id)
                .single();

            return discount ? Object.assign({}, defaultDiscount, discount) as IDiscount : null;
        },
        enabled: !!id,
    });
}

export function useAllDiscounts() {
    return useQuery({
        queryKey: ["discounts", "all"],
        queryFn: async () => {
            const supabase = supabaseClient();
            const { data: discounts } = await supabase
                .from("discounts")
                .select("*")
                .order('created_at', { ascending: false });

            return discounts as IDiscount[];
        },
    });
}
