function normalizeHeader(header) {
  return header
    .replace(/\u00A0/g, " ")      // remove non-breaking spaces
    .replace(/\s+/g, " ")         // collapse multiple spaces
    .trim()
    .toLowerCase();
}

export function validateHeaders(actual, expected) {

  const normalizedActual = actual.map(h => normalizeHeader(h));
  const normalizedExpected = expected.map(h => normalizeHeader(h));

  for (const expectedHeader of normalizedExpected) {
    if (!normalizedActual.includes(expectedHeader)) {
      console.error("Missing header:", expectedHeader);
      console.error("Actual headers received:", normalizedActual);
      return false;
    }
  }

  return true;
}
