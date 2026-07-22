import { z } from "zod";

export const submissionSchema = z.object({
  requestType: z.enum(["add", "edit"]),
  companyName: z.string().trim().min(2, "Company name is required").max(120),
  companySlug: z.string().trim().max(120).optional(),
  website: z.string().trim().url("Enter a valid website URL").max(300).optional().or(z.literal("")),
  submitterName: z.string().trim().min(2, "Your name is required").max(80),
  submitterEmail: z.string().trim().email("Enter a valid email").max(120),
  message: z.string().trim().min(20, "Please describe the add or edit request (min 20 characters)").max(4000),
  subscribeToUpdates: z.boolean().optional(),
  acceptPolicy: z
    .boolean({ message: "You must accept the Privacy Policy and Terms" })
    .refine((v) => v === true, { message: "You must accept the Privacy Policy and Terms" }),
  turnstileToken: z.string().optional(),
  websiteField: z.string().optional(),
  formStartedAt: z.number().optional(),
});

export const feedbackSchema = z.object({
  name: z.string().trim().min(2, "Your name is required").max(80),
  email: z.string().trim().email("Enter a valid email").max(120),
  helped: z.enum(["yes", "somewhat", "no"], { message: "Please select an option" }),
  message: z.string().trim().max(2000).optional(),
  acceptPolicy: z
    .boolean({ message: "You must accept the Privacy Policy and Terms" })
    .refine((v) => v === true, { message: "You must accept the Privacy Policy and Terms" }),
  turnstileToken: z.string().optional(),
  websiteField: z.string().optional(),
  formStartedAt: z.number().optional(),
});

export type SubmissionInput = z.infer<typeof submissionSchema>;
export type FeedbackInput = z.infer<typeof feedbackSchema>;
