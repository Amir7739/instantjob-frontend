// Function to get the candidate ID from localStorage
export const getCandidateId = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("id");
  }
  return null;
};

// Function to get the role from localStorage
export const getRole = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("role");
  }
  return null;
};

// Function to get the token from localStorage
export const getToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
};

// Function to check if user is logged in
export const isLoggedIn = (): boolean => {
  return typeof window !== "undefined" && !!getToken();
};

// Function to check if the user is a candidate
export const isCandidate = (): boolean => {
  return typeof window !== "undefined" && getRole() === "candidate";
};
