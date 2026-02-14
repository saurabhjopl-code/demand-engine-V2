export function validateSheetData(data, sheetName) {

  if (!Array.isArray(data)) {
    console.error(`Invalid data format for ${sheetName}`);
    return false;
  }

  if (data.length === 0) {
    console.warn(`Warning: ${sheetName} returned 0 rows`);
    return false;
  }

  return true;
}
