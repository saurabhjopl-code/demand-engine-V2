export function parseCSV(text) {

  const rows = text.trim().split(/\r?\n/);

  const headers = rows[0].split(",").map(h => h.trim());

  return rows.slice(1).map(row => {

    const values = row.split(",");
    const obj = {};

    headers.forEach((header, index) => {
      obj[header] = values[index] ? values[index].trim() : "";
    });

    return obj;
  });
}
