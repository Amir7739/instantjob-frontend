export interface RegisterPayload {
    full_name: string;
    email: string;
    phone: string;
    password: string;
    role: "admin" | "candidate";
  }
  
  export interface AuthResponse {
    message: string;
    token: string | null;
    user: {
      _id: string;
      full_name: string;
      email: string;
      phone: string;
      role: string;
    } | null;
  }


  export interface LoginPayload {
    emailOrPhone: string;
    password: string;
  }
  
  