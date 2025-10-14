import React from "react";

interface Accessory {
  id: string;
  name?: string;
}

const page = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/accessories`, {
    cache: "no-store",
  });

  if (!res.ok) {
    return <div>Error fetching data</div>;
  }

  const accessories: Accessory[] = await res.json();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Accessories</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {accessories.map((accessory) => (
          <div key={accessory.id} className="border rounded-lg p-4 shadow">
            <h2 className="text-lg font-semibold">{accessory.name || "No Name"}</h2>
          </div>
        ))}
      </div>
    </div>
  );
};

export default page;
