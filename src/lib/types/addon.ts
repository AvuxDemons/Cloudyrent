import z from "zod"

export const addOnSchema = z.object({
    id: z.string().optional(),
    image: z.string().optional(),
    name: z.string().min(1, "Nama barang tidak boleh kosong"),
    price: z.number().min(0, "Harga barang tidak boleh negatif"),
    stock: z.number().min(0, "Stok barang tidak boleh negatif"),
});

export type IAddOn = z.infer<typeof addOnSchema>;

export const defaultAddOn: IAddOn = {
    id: undefined,
    image: '',
    name: '',
    price: 0,
    stock: 0,
};