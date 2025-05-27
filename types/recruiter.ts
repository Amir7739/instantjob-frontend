export interface Recruiter {
  _id: string;
  full_name: string;
  email: string;
  createdAt?: string;
}

export interface Candidate {
  _id: string;
  name: string;
  email: string;
  resume?: File | null;
  createdAt?: string;
}

export interface FormDataRecruiter {
  full_name: string;
  email: string;
  password: string;
}

export interface SnackbarState {
  open: boolean;
  message: string;
  severity: 'success' | 'error' | 'warning' | 'info';
}