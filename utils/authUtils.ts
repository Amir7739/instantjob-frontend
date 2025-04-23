// utils/authUtils.ts

// Function to get the candidate ID from localStorage
export const getCandidateId = (): string | null => {
  if (typeof window !== "undefined") {
    // We are in the browser, so localStorage is available
    return localStorage.getItem("id");
  }
  return null; // In case of SSR or if localStorage is unavailable
};

  
  // Function to get the role from localStorage
  export const getRole = (): string | null => {
    return localStorage.getItem("role");
  };
  
  // Function to get the token from localStorage
  export const getToken = (): string | null => {
    return localStorage.getItem("token");
  };
  
  // Function to check if user is logged in
  export const isLoggedIn = (): boolean => {
    return !!getToken();  // If token exists, user is logged in
  };
  
  // Function to check if the user is a candidate
  export const isCandidate = (): boolean => {
    return getRole() === "candidate";  // Role should be "candidate"
  };
  