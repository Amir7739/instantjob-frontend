import * as XLSX from 'xlsx';
import { Dispatch, SetStateAction } from 'react';
import {
  fetchInitialCandidates,
  fetchInitialInActiveCandidates,
} from '@/services/candidates';
import axiosInstance from './axios';

interface ExcelUploadParams {
  file: File;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  setError: Dispatch<SetStateAction<string | null>>;
  setSuccessMessage: Dispatch<SetStateAction<string | null>>;
  setCandidates: Dispatch<SetStateAction<any[]>>;
  setTotalCandidates: Dispatch<SetStateAction<number>>;
  showInactive: boolean;
}

export const handleExcelUpload = async ({
  file,
  setIsLoading,
  setError,
  setSuccessMessage,
  setCandidates,
  setTotalCandidates,
  showInactive,
}: ExcelUploadParams) => {
  try {
    setIsLoading(true);
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        // Send data to backend
        const response = await axiosInstance.post('/auth/add-bulk-candidate', { candidates: jsonData });
        setSuccessMessage(`Successfully uploaded ${response.data.saved} candidates`);
        if (response.data.errors) {
          setError(`Failed to upload some candidates: ${response.data.errors.map((e: any) => e.error).join(', ')}`);
        }
        // Refresh candidate list
        const initialResponse = showInactive
          ? await fetchInitialInActiveCandidates()
          : await fetchInitialCandidates();
        setCandidates(initialResponse.candidates);
        setTotalCandidates(initialResponse.pagination.totalCandidates);
      } catch (error: any) {
        setError(error.response?.data?.message || 'Error uploading candidates');
      } finally {
        setIsLoading(false);
      }
    };
    reader.readAsArrayBuffer(file);
  } catch (error) {
    setError('Error processing Excel file');
    setIsLoading(false);
  }
};