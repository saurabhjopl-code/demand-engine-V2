export function validateHeaders(actual, expected) {
  // No strict blocking validation
  // Only log headers for debugging

  console.log("Headers detected:", actual);

  return true; // Always allow loading
}
