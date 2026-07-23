import { corsPreflightResponse } from "@/lib/api/cors";
import { handleFormSubmit } from "@/lib/api/submit-handler";
import {
  buildFeedbackAdminEmail,
  buildFeedbackUserEmail,
} from "@/lib/email-templates";
import { saveFeedback } from "@/lib/feedback-store";
import { feedbackSchema } from "@/lib/validators";

export async function OPTIONS(request: Request) {
  return corsPreflightResponse(request);
}

export async function POST(request: Request) {
  return handleFormSubmit({
    request,
    schema: feedbackSchema,
    buildAdmin: buildFeedbackAdminEmail,
    buildUser: buildFeedbackUserEmail,
    save: saveFeedback,
    requireStorage: false,
  });
}
