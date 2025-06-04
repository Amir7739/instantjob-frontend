export interface Candidate {
  _id: string;
  full_name: string;
  email: string;
  phone: string;
  jobRole: string; // Optional, as per schema
  exp: string; // Optional, as per schema
  resumeUrl?: string; // Optional, as per schema
  createdBy?: string; // Optional, to match schema (not used in form)
  createdAt?: string; // Optional, for timestamps
  updatedAt?: string; // Optional, for timestamps
}

export interface FormValues {
  full_name: string;
  email: string;
  phone: string;
  jobRole: string;
  exp : string;
  resume: File | null;
}

export interface SnackbarState {
  open: boolean;
  message: string;
  severity: 'success' | 'error';
}