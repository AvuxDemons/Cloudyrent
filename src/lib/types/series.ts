import z from "zod"

export const seriesSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(1, "Name is required"),
    category: z.string().optional(),
});

export type ISeries = z.infer<typeof seriesSchema>;

export const defaultSeries: ISeries = {
    id: undefined,
    name: "",
    category: ""
};
