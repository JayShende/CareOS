import { z } from "zod";

const resposne = z.object({
  body: z.object({
    formId: z.string({ message: "formId must be a valid String" }),
    submissionUserId: z
      .string({ message: "submissionUserId must be a valid String" })
      .optional()
      .nullable(),

    answers: z.array(
      z.object({
        questionId: z.string({ message: "questionId must be a valid String" }),

        text: z.string({ message: "text must be a valid String" }).optional(),
        files: z
          .array(z.string({ message: "Each file must be a valid URL" }))
          .optional(),

        options: z
          .array(
            z.object({
              optionId: z.string({
                message: "optionId must be a valid String",
              }),
            })
          )
          .optional(),
      })
    ),
  }),
});

export default {
  resposne,
};