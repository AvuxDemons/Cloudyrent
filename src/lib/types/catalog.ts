import z from "zod"

export interface ICostumeAttribute {
    key: string
    label: string
}

export const catalogSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(1, "Name is required"),
    slug: z.string().optional(),
    price: z.number().min(1000, "Price must be at least Rp 1000"),
    status: z.string().min(1, "Status is required"),
    is_weekday: z.boolean(),
    weight: z.number().min(0, "Weight must be at least 1 gram"),
    length: z.number().min(0, "Length must be at least 1 cm"),
    height: z.number().min(0, "Height must be at least 1 cm"),
    width: z.number().min(0, "Width must be at least 1 cm"),
    description: z.string().min(1, "Description is required"),
    important_info: z.string().optional(),
    images: z.array(z.string()).min(1, "At least one image is required"),
    catalog_type: z.enum(["costume", "bundle"]).default("costume"),
    brand_id: z.object({
        id: z.string().min(1, "Brand is required"),
    }),
    character_id: z.object({
        id: z.string().min(1, "Character is required"),
    }),
    size: z.string().min(1, "Size is required"),
    max_size: z.string().optional(),
    gender: z.enum(["male", "female", "unisex"]).default("unisex"),
    bundle_catalog: z.array(z.string()).optional(),
});

export type ICatalog = z.infer<typeof catalogSchema>;

// Extended type for catalog with nested relationships
export interface ICatalogWithRelations extends Omit<ICatalog, 'brand_id' | 'character_id'> {
    brand?: {
        id: string;
        name: string;
        created_at: string;
        updated_at: string;
    };
    character?: {
        id: string;
        name: string;
        series_id: string;
        series?: {
            id: string;
            name: string;
            category: string;
            created_at: string;
            updated_at: string;
        };
        created_at: string;
        updated_at: string;
    };
    created_at?: string;
    updated_at?: string;
    is_bundle?: boolean;
}

// Type guards for bundle functionality
export const isBundleCatalog = (catalog: ICatalog): boolean => {
    return catalog.catalog_type === "bundle";
};

export const isSingleCatalog = (catalog: ICatalog): boolean => {
    return catalog.catalog_type === "costume";
};

// Helper function to create a default catalog
export const createDefaultCatalog = (): ICatalog => {
    return {
        id: undefined,
        name: "",
        slug: "",
        images: [],
        price: 0,
        is_weekday: false,
        description: "",
        important_info: "",
        status: "",
        weight: 0,
        length: 0,
        width: 0,
        height: 0,
        catalog_type: "costume",
        brand_id: { id: "" },
        character_id: { id: "" },
        size: "",
        max_size: "",
        gender: "unisex",
        bundle_catalog: [],
    } as ICatalog;
};

// Default catalog
export const defaultCatalog = createDefaultCatalog();
