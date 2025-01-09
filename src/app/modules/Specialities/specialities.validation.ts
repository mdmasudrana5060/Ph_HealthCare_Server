import { string, z } from "zod";
const createSpecialities = z.object({
  body: z.object({
    title: string({
      required_error: "Title is required",
    }),
  }),
});

export const specialitesValidation = {
  createSpecialities,
};
