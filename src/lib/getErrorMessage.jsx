// express-rate-limit sends its 429 "message" as a raw string body, not
// { message }, so that case needs its own check. Everything else follows
// the { message } shape your controllers use consistently.
export function getErrorMessage(error, fallback = "Something went wrong. Please try again.") {
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }

  if (typeof error?.response?.data === "string" && error.response.data) {
    return error.response.data;
  }

  if (error?.message === "Network Error") {
    return "Network error. Please check your connection.";
  }

  if (error?.code === "ECONNABORTED") {
    return "The request took too long. Please try again.";
  }

  return fallback;
}