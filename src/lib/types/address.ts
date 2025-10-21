import z from "zod";

export const addressSchema = z.object({
    id: z.string().optional(),
    label: z.string().min(1, "Label is required"),
    receiver: z.string().min(1, "Receiver is required"),
    full_address: z.string().min(1, "Full Address is required"),
    address_details: z.string(),
    user: z.string().min(1, "User is required"),
    latitude: z.number().nullable(),
    longitude: z.number().nullable(),
});

export type IAddress = z.infer<typeof addressSchema>;

export const defaultAddress: IAddress = {
    id: undefined,
    label: "",
    receiver: "",
    full_address: "",
    address_details: "",
    user: "",
    latitude: null,
    longitude: null,
};