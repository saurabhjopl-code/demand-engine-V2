export function getSCClass(sc) {

  if (sc < 30) return "sc-critical";
  if (sc >= 30 && sc < 45) return "sc-risk";
  if (sc >= 45 && sc < 60) return "sc-healthy";
  if (sc >= 60 && sc < 90) return "sc-safe";
  if (sc >= 90 && sc < 120) return "sc-watch";
  return "sc-good";
}
