// src/utils/logout.ts

export const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  localStorage.removeItem("id");

  // Optional: clear all localStorage if needed
  // localStorage.clear();
};
