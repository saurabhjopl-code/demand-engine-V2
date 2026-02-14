export function parseCSV(text) {

  text = text.replace(/^\uFEFF/, "");

  const lines = text.trim().split("\n");

  const headers = lines[0].split(",").map(h => h.trim());

  const data = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(",");
    const row = {};

    headers.forEach((h, index) => {
      row[h] = values[index] ? values[index].trim() : "";
    });

    data.push(row);
  }

  return { headers, data };
}
