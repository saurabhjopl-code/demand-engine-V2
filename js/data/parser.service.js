export function parseCSV(text) {

  text = text.replace(/^\uFEFF/, "");

  const lines = text.trim().split("\n");

  // 🔍 DEBUG: Log raw header line
  console.log("RAW HEADER LINE:", lines[0]);

  // Simple split first to inspect
  const rawSplit = lines[0].split(",");
  console.log("RAW SPLIT RESULT:", rawSplit);

  const headers = rawSplit.map(h => h.trim());

  const data = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(",");
    const row = {};
    headers.forEach((h, index) => {
      row[h] = values[index] || "";
    });
    data.push(row);
  }

  return { headers, data };
}
