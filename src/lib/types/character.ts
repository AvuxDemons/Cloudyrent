import z from "zod"

export const characterSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(1, "Name is required"),
    series_id: z.string().min(1, "Series is required"),
});

export type ICharacter = z.infer<typeof characterSchema>;

export const defaultCharacter: ICharacter = {
    id: undefined,
    name: "",
    series_id: ""
};
