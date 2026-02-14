export function validateHeaders(actual, expected) {

  // Normalize both arrays
  const cleanActual = actual.map(h => h.trim());
  const cleanExpected = expected.map(h => h.trim());

  // Check each expected header exists in actual
  for (const header of cleanExpected) {
    if (!cleanActual.includes(header)) {
      console.error("Missing header:", header);
      return false;
    }
  }

  return true;
}
