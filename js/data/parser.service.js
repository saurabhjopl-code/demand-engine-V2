export function parseCSV(text) {
  const rows = text.trim().split("\n").map(r => r.split(","));
  const headers = rows.shift().map(h => h.trim());

  const data = rows.map(row => {
    const obj = {};
    headers.forEach((h, i) => {
      obj[h] = row[i] ? row[i].trim() : "";
    });
    return obj;
  });

  return { headers, data };
}
