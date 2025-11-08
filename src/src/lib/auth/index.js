export function login(email, password) {
  if (email === "admin@gmail.com" && password === "123456") {
    document.cookie = "auth=true; path=/";
    return true;
  }
  return false;
}

export function logout() {
  document.cookie = "auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
}

export function isAuthenticated() {
  if (typeof document === "undefined") return false;
  return document.cookie.includes("auth=true");
}
