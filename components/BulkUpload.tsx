'use client'

import React, { useState } from "react";
import { 
  Button, 
  Box, 
  Typography, 
  LinearProgress, 
  Paper,
  Stack,
  Card,
  CardContent,
  Chip,
  Alert,
  Divider,
  useTheme,
  alpha
} from "@mui/material";
import {
  CloudUpload,
  Description,
  PictureAsPdf,
  FileUpload,
  CheckCircle,
  Error as ErrorIcon
} from "@mui/icons-material";
import axiosInstance from "@/utils/axios";

const BulkUpload = () => {
  const theme = useTheme();
  const [excelFile, setExcelFile] = useState<File | null>(null);
  const [resumeFiles, setResumeFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');

  const handleExcelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      setExcelFile(e.target.files[0]);
      setMessage(''); // Clear previous messages
    }
  };

  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      setResumeFiles(Array.from(e.target.files));
      setMessage(''); // Clear previous messages
    }
  };

  const handleSubmit = async () => {
    if (!excelFile) {
      setMessage("Please upload Excel file.");
      setMessageType('error');
      return;
    }

    if (resumeFiles.length === 0) {
      setMessage("Please upload at least one resume file.");
      setMessageType('error');
      return;
    }

    setLoading(true);
    setMessage("");
    setMessageType('');

    const formData = new FormData();
    formData.append("excel", excelFile);
    resumeFiles.forEach((file) => formData.append("resumes", file));

    try {
      const res = await axiosInstance.post("/upload-bulk-candidates", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage(res.data.message);
      setMessageType('success');
    } catch (err: any) {
      setMessage(err.response?.data?.message || "Upload failed");
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Paper 
      elevation={2} 
      sx={{ 
        maxWidth: 600, 
        mx: "auto", 
        mt: 4, 
        p: 4,
        borderRadius: 3,
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`
      }}
    >
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <CloudUpload sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
        <Typography variant="h4" fontWeight={700} color="primary" gutterBottom>
          Bulk Upload Candidates
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Upload Excel file with candidate data and their corresponding resumes
        </Typography>
      </Box>

      <Stack spacing={3}>
        {/* Excel File Upload Section */}
        <Card elevation={1} sx={{ borderRadius: 2 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Description sx={{ color: 'success.main', mr: 1 }} />
              <Typography variant="h6" fontWeight={600}>
                Excel File Upload
              </Typography>
              <Chip label="Required" color="error" variant="outlined" size="small" sx={{ ml: 'auto' }} />
            </Box>
            
            <Button 
              variant="outlined" 
              component="label" 
              fullWidth
              startIcon={<FileUpload />}
              sx={{ 
                py: 2,
                borderStyle: 'dashed',
                borderWidth: 2,
                '&:hover': {
                  borderStyle: 'dashed',
                  borderWidth: 2,
                  bgcolor: alpha(theme.palette.primary.main, 0.04)
                }
              }}
            >
              Choose Excel File (.xls, .xlsx)
              <input
                type="file"
                hidden
                accept=".xls,.xlsx"
                onChange={handleExcelChange}
              />
            </Button>
            
            {excelFile && (
              <Box sx={{ mt: 2, p: 2, bgcolor: 'success.50', borderRadius: 1, border: '1px solid', borderColor: 'success.200' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckCircle sx={{ color: 'success.main', fontSize: 20 }} />
                  <Typography variant="body2" fontWeight={500}>
                    {excelFile.name}
                  </Typography>
                  <Chip 
                    label={formatFileSize(excelFile.size)} 
                    size="small" 
                    color="success" 
                    variant="outlined"
                    sx={{ ml: 'auto' }}
                  />
                </Box>
              </Box>
            )}
          </CardContent>
        </Card>

        {/* Resume Files Upload Section */}
        <Card elevation={1} sx={{ borderRadius: 2 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <PictureAsPdf sx={{ color: 'error.main', mr: 1 }} />
              <Typography variant="h6" fontWeight={600}>
                Resume Files Upload
              </Typography>
              <Chip label="Required" color="error" variant="outlined" size="small" sx={{ ml: 'auto' }} />
            </Box>
            
            <Button 
              variant="outlined" 
              component="label" 
              fullWidth
              startIcon={<FileUpload />}
              sx={{ 
                py: 2,
                borderStyle: 'dashed',
                borderWidth: 2,
                color: 'error.main',
                borderColor: 'error.main',
                '&:hover': {
                  borderStyle: 'dashed',
                  borderWidth: 2,
                  bgcolor: alpha(theme.palette.error.main, 0.04),
                  borderColor: 'error.main'
                }
              }}
            >
              Choose PDF Files (Multiple Selection)
              <input
                type="file"
                hidden
                accept=".pdf"
                multiple
                onChange={handleResumeChange}
              />
            </Button>
            
            {resumeFiles.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <CheckCircle sx={{ color: 'success.main', fontSize: 20 }} />
                  <Typography variant="body2" fontWeight={500}>
                    {resumeFiles.length} PDF files selected
                  </Typography>
                  <Chip 
                    label={`Total: ${formatFileSize(resumeFiles.reduce((acc, file) => acc + file.size, 0))}`} 
                    size="small" 
                    color="info" 
                    variant="outlined"
                    sx={{ ml: 'auto' }}
                  />
                </Box>
                <Box sx={{ maxHeight: 150, overflow: 'auto', bgcolor: 'grey.50', borderRadius: 1, p: 1 }}>
                  {resumeFiles.map((file, index) => (
                    <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 0.5 }}>
                      <PictureAsPdf sx={{ color: 'error.main', fontSize: 16 }} />
                      <Typography variant="body2" sx={{ fontSize: '0.75rem', flex: 1 }}>
                        {file.name}
                      </Typography>
                      <Typography variant="body2" sx={{ fontSize: '0.7rem', color: 'text.secondary' }}>
                        {formatFileSize(file.size)}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            )}
          </CardContent>
        </Card>

        <Divider />

        {/* Submit Section */}
        <Box sx={{ textAlign: 'center' }}>
          <Button 
            variant="contained" 
            size="large"
            onClick={handleSubmit} 
            disabled={loading || !excelFile || resumeFiles.length === 0}
            startIcon={loading ? undefined : <CloudUpload />}
            sx={{ 
              py: 1.5,
              px: 4,
              fontSize: '1.1rem',
              fontWeight: 600,
              borderRadius: 2,
              boxShadow: 3,
              '&:hover': {
                boxShadow: 6
              }
            }}
          >
            {loading ? "Uploading..." : "Upload Candidates"}
          </Button>
        </Box>

        {/* Progress Bar */}
        {loading && (
          <LinearProgress 
            sx={{ 
              borderRadius: 1,
              height: 8,
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              '& .MuiLinearProgress-bar': {
                borderRadius: 1
              }
            }} 
          />
        )}

        {/* Message Alert */}
        {message && (
          <Alert 
            severity={messageType === 'success' ? 'success' : 'error'}
            icon={messageType === 'success' ? <CheckCircle /> : <ErrorIcon />}
            sx={{ borderRadius: 2 }}
          >
            <Typography variant="body2" fontWeight={500}>
              {message}
            </Typography>
          </Alert>
        )}
      </Stack>
    </Paper>
  );
};

export default BulkUpload;