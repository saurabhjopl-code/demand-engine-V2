export async function fetchCSV(url) {

  const response = await fetch(url, {
    method: "GET",
    cache: "no-cache"
  });

  if (!response.ok) {
    throw new Error(`Fetch failed: ${response.status}`);
  }

  return await response.text();
}
