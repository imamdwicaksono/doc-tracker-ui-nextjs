import { ResponseError } from "@/types/types";

export function handleError(error: ResponseError, context: string) {
  console.error("API Error:", error);
  if(error.error === "Unauthorized") {
    window.location.href = "/auth/login";
  }
  if(error.error === "Forbidden") {
    window.location.href = "/auth/login";
  }
  if(error.error === "Not Found") {
    window.location.href = "/auth/login";
  }
  return (`API Error in ${context}: ${error.error}`);
}
