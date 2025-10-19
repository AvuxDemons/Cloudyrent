"use client";
import { Button, Input, Slider, Select, SelectItem } from "@heroui/react";
import React, { useState, useEffect } from "react";
import Link from "next/link";

interface Accessory {
  id: string;
  name?: string;
  price?: number;
  size?: string;
  gender?: string;
  category?: string;
  image?: string;
}

const Page = () => {
  const [accessories, setAccessories] = useState<Accessory[]>([]);
  const [filteredAccessories, setFilteredAccessories] = useState<Accessory[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter state
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000]);
  const [size, setSize] = useState("");
  const [gender, setGender] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    const fetchAccessories = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/accessories`, {
          cache: "no-store",
        });

        if (!res.ok) throw new Error("Failed to fetch data");

        const data: Accessory[] = await res.json();
        setAccessories(data);
        setFilteredAccessories(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchAccessories();
  }, []);

  // Filter logic
  useEffect(() => {
    let filtered = accessories.filter((item) =>
      item.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    filtered = filtered.filter((item) => {
      const price = item.price || 0;
      return price >= priceRange[0] && price <= priceRange[1];
    });

    if (size) filtered = filtered.filter((item) => item.size === size);
    if (gender) filtered = filtered.filter((item) => item.gender === gender);
    if (category) filtered = filtered.filter((item) => item.category === category);

    setFilteredAccessories(filtered);
  }, [searchTerm, accessories, priceRange, size, gender, category]);

  const resetFilters = () => {
    setSearchTerm("");
    setPriceRange([0, 1000000]);
    setSize("");
    setGender("");
    setCategory("");
    setFilteredAccessories(accessories);
  };

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-500">Error: {error}</div>;

  return (
    <div className="flex gap-8 p-8 bg-gray-50 min-h-screen">
      {/* LEFT FILTER PANEL */}
      <div className="w-80 bg-white border border-gray-200 rounded-2xl p-6 shadow-md">
        <h2 className="font-bold text-lg text-gray-800 mb-1">Filter Catalog</h2>
        <p className="text-sm text-gray-500 mb-6">Find Your Favorite Costume</p>

        {/* Filter - Penggunaan */}
        <div className="mb-6">
          <label className="font-semibold text-sm text-gray-700 mb-2 block">Penggunaan</label>
          <div className="flex gap-2">
            <Button size="sm" variant="flat" color="primary">
              Event
            </Button>
            <Button size="sm" variant="flat" color="primary">
              Photo Session Only
            </Button>
            <Button size="sm" variant="flat" color="secondary">
              All
            </Button>
          </div>
        </div>

        {/* Filter - Harga */}
        <div className="mb-6">
          <label className="font-semibold text-sm text-gray-700">Harga</label>
          <Slider
            minValue={0}
            maxValue={1000000}
            step={50000}
            value={priceRange}
            onChange={(val: any) => setPriceRange(val)}
          />
          <div className="text-sm text-gray-600 mt-1">
            Rp.{priceRange[0].toLocaleString()} - Rp.{priceRange[1].toLocaleString()}
          </div>
        </div>

        {/* Size & Gender */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <Select
            label="Size"
            selectedKeys={[size]}
            onChange={(e) => setSize(e.target.value)}
          >
            <SelectItem key="S">S</SelectItem>
            <SelectItem key="M">M</SelectItem>
            <SelectItem key="L">L</SelectItem>
          </Select>

          <Select
            label="Gender"
            selectedKeys={[gender]}
            onChange={(e) => setGender(e.target.value)}
          >
            <SelectItem key="Male">Male</SelectItem>
            <SelectItem key="Female">Female</SelectItem>
            <SelectItem key="Unisex">Unisex</SelectItem>
          </Select>
        </div>

        {/* Brand, Series, Character */}
        <div className="space-y-4">
          <Input label="Brand" value={category} onChange={(e) => setCategory(e.target.value)} />
          <Input label="Series" />
          <Input label="Character" />
        </div>

        <div className="flex justify-between mt-6">
          <Button color="primary" className="w-[48%] font-semibold">
            Apply
          </Button>
          <Button
            color="default"
            variant="flat"
            onClick={resetFilters}
            className="w-[48%] font-semibold"
          >
            Reset
          </Button>
        </div>
      </div>

      {/* RIGHT CONTENT GRID */}
      <div className="flex-1 ">
        <div className="flex justify-between mb-4">
          <Input
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filteredAccessories.map((item) => (
            <div key={item.id} className="border rounded-xl p-3 bg-white shadow-sm hover:shadow-md transition">
              <img
                src={item.image || "/placeholder.png"}
                alt={item.name}
                className="rounded-md mb-3 w-full aspect-[3/4] object-cover"
              />
              <h3 className="font-semibold text-base text-gray-800">
                {item.name || "Nama Kostum"}
              </h3>
              <p className="text-gray-600 text-sm">
                Rp.{item.price?.toLocaleString() || "-"}
              </p>
              <div className="flex justify-end mt-2">
                <Link href={`/catalog/${item.id}`}>
                  <Button color="primary" variant="flat" size="sm">
                    →
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div> 
      </div>
    </div>
  );
};

export default Page;
