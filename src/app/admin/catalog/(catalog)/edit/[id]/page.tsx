"use client";

import { useParams } from "next/navigation";
import CatalogForm from "../../../_Components/Catalog/CatalogForm";

const EditCatalogPage = () => {
  const { id } = useParams();

  return <CatalogForm mode="edit" catalogId={id as string} />;
};

export default EditCatalogPage;
