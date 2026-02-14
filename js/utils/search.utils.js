export function applyGlobalSearch(data, fields) {

  const term = window.globalSearchTerm || "";

  if (!term) return data;

  return data.filter(row => {

    return fields.some(field => {
      const value = row[field];
      if (!value) return false;
      return String(value).includes(term);
    });

  });
}
