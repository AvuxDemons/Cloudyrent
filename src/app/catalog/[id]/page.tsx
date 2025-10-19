"use client";
import { Button, Select, SelectItem } from "@heroui/react";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";

interface Accessory {
  id: string;
  name?: string;
  price?: number;
  size?: string;
  gender?: string;
  category?: string;
  image?: string;
}

const DetailPage = () => {
  const { id } = useParams();
  const [accessory, setAccessory] = useState<Accessory | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAccessory = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/accessories`, {
          cache: "no-store",
        });

        if (!res.ok) throw new Error("Failed to fetch data");

        const data: Accessory[] = await res.json();
        const found = data.find((item) => String(item.id) === id);
        if (!found) throw new Error("Accessory not found");

        setAccessory(found);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchAccessory();
  }, [id]);

  if (loading) return <div className="p-8">Loading...</div>;
  if (error || !accessory) return <div className="p-8 text-red-500">Error: {error || "Not found"}</div>;

  return (
    <div className="max-w-4xl mx-auto p-8 bg-gray-50 min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Image */}
        <div>
          <img
            src={accessory.image || "/placeholder.png"}
            alt={accessory.name}
            className="rounded-lg w-full h-auto aspect-[4/5] object-cover shadow-lg"
          />
        </div>

        {/* Details */}
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-gray-800">{accessory.name || "Nama Kostum"}</h1>
          <p className="text-2xl text-gray-700 font-semibold">Rp.{accessory.price?.toLocaleString()}</p>

          <div className="space-y-4">
            <div>
              <label className="font-semibold text-gray-700">Size:</label>
              <p className="text-gray-600">{accessory.size || "N/A"}</p>
            </div>
            <div>
              <label className="font-semibold text-gray-700">Gender:</label>
              <p className="text-gray-600">{accessory.gender || "N/A"}</p>
            </div>
            <div>
              <label className="font-semibold text-gray-700">Category:</label>
              <p className="text-gray-600">{accessory.category || "N/A"}</p>
            </div>
          </div>

          <div className="flex gap-4 mt-8">
            <Button color="primary" size="lg" className="flex-1">
              Sewa Sekarang
            </Button>
            <Button variant="bordered" color="primary" size="lg">
              Tambah ke Favorit
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailPage;
