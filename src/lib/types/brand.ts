import z from "zod"

export const brandSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(1, "Name is required"),
});

export type IBrand = z.infer<typeof brandSchema>;

export const defaultBrand: IBrand = {
    id: undefined,
    name: ""
};