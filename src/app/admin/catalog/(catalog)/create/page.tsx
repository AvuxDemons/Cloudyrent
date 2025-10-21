"use client";

import { useSearchParams } from "next/navigation";
import CatalogForm from "../../_Components/Catalog/CatalogForm";

const CreateCatalogPage = () => {
  const searchParams = useSearchParams();
  const catalogType = searchParams.get("type") as "single" | "bundle" | null;

  return <CatalogForm mode="create" catalogType={catalogType || "single"} />;
};

export default CreateCatalogPage;
