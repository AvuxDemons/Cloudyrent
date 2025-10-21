import z from "zod";

export const userSchema = z.object({
    email: z.email(),
    image: z.string(),
    name: z.string(),
    full_name: z.string().min(1, "Full name is required"),
    phone_whatsapp: z.string().min(1, "Phone number is required"),
    emergency_contact: z.string().min(1, "Emergency contact is required"),
    address: z.array(z.string()).optional(),
    identity_pict: z.string().min(1, "Identity picture is required"),
    selfie_pict: z.string().min(1, "Selfie picture is required"),
    rent_proof: z.array(z.string()).min(2, "Rent proof must contain at least 2 images"),
    instagram: z.string(),
    tiktok: z.string(),
    twitter: z.string(),
    facebook: z.string(),
    total_rent: z.number(),
    is_blacklist: z.boolean(),
    is_admin: z.boolean(),
})

export type IUser = z.infer<typeof userSchema>

export const defaultUser: IUser = {
    email: '',
    image: '',
    name: '',
    full_name: '',
    phone_whatsapp: '',
    emergency_contact: '',
    address: [],
    identity_pict: '',
    selfie_pict: '',
    rent_proof: [],
    instagram: '',
    tiktok: '',
    twitter: '',
    facebook: '',
    total_rent: 0,
    is_blacklist: false,
    is_admin: false,
}