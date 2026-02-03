export const normalizeList = (data) =>
  Array.isArray(data) ? data : Array.isArray(data?.content) ? data.content : [];
