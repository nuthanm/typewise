import { corsPreflightResponse } from "@/lib/api/cors";
import { handleSubmissionPost } from "@/lib/api/submit-handler";

export async function OPTIONS(request: Request) {
  return corsPreflightResponse(request);
}

export async function POST(request: Request) {
  return handleSubmissionPost(request);
}
