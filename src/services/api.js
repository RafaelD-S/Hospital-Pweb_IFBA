const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8080";

const parseErrorMessage = async (response) => {
  const contentType = response.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    try {
      const data = await response.clone().json();
      if (typeof data === "string") return data;
      if (data?.message) return data.message;
      if (data && typeof data === "object")
        return Object.values(data).join("\n");
    } catch {}
  }
  try {
    const text = await response.clone().text();
    if (text) return text;
  } catch {}

  return `Erro na requisição (${response.status}).`;
};

const parseJson = async (response) => {
  try {
    return await response.json();
  } catch {
    return null;
  }
};

export const apiRequest = async (path, options = {}) => {
  const { method = "GET", token, body, headers = {} } = options;

  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

  if (!response.ok) {
    const message = await parseErrorMessage(response);
    throw new Error(message);
  }

  return parseJson(response);
};
