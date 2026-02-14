const API_BASE_URL =
  (import.meta as any).env.VITE_API_BASE || "http://localhost:5000/api";

export const askChatbot = async (question: string, token: string | null) => {
  try {
    const response = await fetch(`${API_BASE_URL}/chat/ask`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ question }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Chat error");
    }
    return data.data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

export const loginUser = async (credentials: any) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });
  const data = await response.json();
  if (response.ok && data.data) {
    try {
      localStorage.setItem("foodToken", data.data.token);
      localStorage.setItem("user", JSON.stringify(data.data.user));
    } catch (e) {
      console.warn("Could not store auth data in localStorage", e);
    }
  }
  return data;
};

export const signupUser = async (payload: any) => {
  const response = await fetch(`${API_BASE_URL}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await response.json();
  if (response.ok && data.data) {
    try {
      localStorage.setItem("foodToken", data.data.token);
      localStorage.setItem("user", JSON.stringify(data.data.user));
    } catch (e) {
      console.warn("Could not store auth data in localStorage", e);
    }
  }
  return data;
};

export const getDocuments = async (token: string) => {
  const response = await fetch(`${API_BASE_URL}/chat/documents`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await response.json();
  return data.data;
};

export const uploadDocument = async (
  formData: any,
  token: string,
  isFile: boolean = false,
) => {
  const url = isFile
    ? `${API_BASE_URL}/chat/upload/file`
    : `${API_BASE_URL}/chat/upload/text`;
  const headers: any = { Authorization: `Bearer ${token}` };

  // Don't set Content-Type for FormData, browser will do it with boundary
  if (!isFile) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(url, {
    method: "POST",
    headers,
    body: isFile ? formData : JSON.stringify(formData),
  });
  return response.json();
};

export const deleteDocument = async (id: string, token: string) => {
  const response = await fetch(`${API_BASE_URL}/chat/documents/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.json();
};
