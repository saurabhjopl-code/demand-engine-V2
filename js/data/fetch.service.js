export async function fetchCSV(url) {
  try {
    const response = await fetch(url, {
      method: "GET",
      cache: "no-cache"
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const text = await response.text();

    if (!text || text.trim().length === 0) {
      throw new Error("Empty CSV response");
    }

    return text;

  } catch (error) {
    console.error("Fetch failed:", url, error);
    throw error;
  }
}
