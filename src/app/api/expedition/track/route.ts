import { NextResponse } from 'next/server';
import { auth } from "@/lib/auth";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const expedition = searchParams.get('expedition');
    const trackingNumber = searchParams.get('trackingNumber');

    const session = await auth();
    if (!session?.user) {
        return NextResponse.json(
            { success: false, error: "Unauthorized" },
            { status: 401 }
        );
    }

    if (!expedition || !trackingNumber) {
        return NextResponse.json(
            { error: 'Missing expedition or trackingNumber parameter' },
            { status: 400 }
        );
    }

    try {
        const listApiKey = [
            "348162985e5c04aae364c08bc9823cfc4a33fb6bfe147921493fc4d406aac1ca",
            "f10bcea2461e6d438d6ef04ba53025e3991a915142c3f33b75c34efdd25d0071",
            "28af3273d2a83b151ca005917d214693c53db39ca697a2351c620feda1f678be",
            "f94105e1cbab0bfb14a2ce63bcbd04ea3cba2460610d9d88fd5a1807d6cb9918",
            "ead363ba3648f08427b6deb8e5232070bfe8c89eae9240c6865fd317b53f8a3f",
            "3c38e073eda97a2c73f82e4c307de11dd3c9394edaff2e834b78075415c94c96",
        ];

        const apiKey = listApiKey[Math.floor(Math.random() * listApiKey.length)];

        const response = await fetch(
            `https://api.binderbyte.com/v1/track?api_key=${apiKey}&courier=${expedition}&awb=${trackingNumber}`,
            {
                cache: "force-cache",
                next: {
                    revalidate: 21600,
                },
            }
        );
        const result = await response.json();

        return NextResponse.json(result.data);
    } catch (error) {
        console.error('Binderbyte API error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch data from Binderbyte' },
            { status: 500 }
        );
    }
}
