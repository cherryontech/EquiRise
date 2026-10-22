async function request(path, { method = "GET", body } = {}) {
  const res = await fetch(`/api/auth${path}`, {
    method,
    credentials: "include",
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (res.status === 204) return null;

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.message || "Something went wrong. Try again.");
    err.status = res.status;
    throw err;
  }
  return data;
}

export const api = {
  session: () => request("/session"),
  login: (email, password) => request("/login", { method: "POST", body: { email, password } }),
  logout: () => request("/logout", { method: "POST" }),
  forgotPassword: (email) => request("/forgot-password", { method: "POST", body: { email } }),
};
