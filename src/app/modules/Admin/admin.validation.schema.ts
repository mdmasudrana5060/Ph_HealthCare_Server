import { AnyZodObject, z } from "zod";

const updateAdminSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    contactNumber: z.string().optional(),
  }),
});

export const validationSchema = {
  updateAdminSchema,
};