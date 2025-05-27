export interface Candidate {
  _id: string;
  full_name: string;
  email: string;
  phone: string;
  resumeUrl: string;
}

export interface FormValues {
  full_name: string;
  email: string;
  phone: string;
  resume: File | null;
}

export interface SnackbarState {
  open: boolean;
  message: string;
  severity: 'success' | 'error';
}