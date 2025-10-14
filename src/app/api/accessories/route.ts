import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const supabase = await createClient();
        const { data: accessories, error } = await supabase
            .from("accessories")
            .select("*");

        if (error) {
            console.error("Error fetching accessories:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json(accessories);
    } catch (error) {
        console.error("Server error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
