export function authHeaders() {
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  return { headers: { Authorization: `Bearer ${token}` } };
}