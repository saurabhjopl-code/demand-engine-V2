function parseLine(line) {
  const result = [];
  let current = "";
  let insideQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      insideQuotes = !insideQuotes;
      continue;
    }

    if (char === "," && !insideQuotes) {
      result.push(current.trim());
      current = "";
      continue;
    }

    current += char;
  }

  result.push(current.trim());
  return result;
}

export function parseCSV(text) {

  // Remove BOM
  text = text.replace(/^\uFEFF/, "");

  const lines = text.trim().split("\n");

  const headers = parseLine(lines[0]);

  const data = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseLine(lines[i]);

    const row = {};
    headers.forEach((h, index) => {
      row[h] = values[index] || "";
    });

    data.push(row);
  }

  return { headers, data };
}
