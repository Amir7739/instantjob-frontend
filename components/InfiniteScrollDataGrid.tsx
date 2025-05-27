'use client';

import React, { useState, useEffect, useCallback } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Box, CircularProgress, Typography } from '@mui/material';
import { Candidate } from '@/types/candidate';

// Define the props interface with proper typing
interface InfiniteScrollDataGridProps {
  columns: GridColDef[];
  fetchData: (page: number, limit: number) => Promise<{
    candidates: Candidate[];
    total: number;
    page: number;
    totalPages: number;
  }>;
  token: string | null;
  onEdit: (candidate: Candidate) => void;
}

const InfiniteScrollDataGrid: React.FC<InfiniteScrollDataGridProps> = ({
  columns,
  fetchData,
  token,
  onEdit,
}) => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const limit = 10;

  const loadMoreData = useCallback(async () => {
    if (!token || isLoading || !hasMore) return;

    setIsLoading(true);
    try {
      const response = await fetchData(page, limit);
      // Ensure candidates is an array before spreading
      const newCandidates = Array.isArray(response.candidates) ? response.candidates : [];
      setCandidates((prev) => [...prev, ...newCandidates]);
      setHasMore(page < response.totalPages);
      setPage((prev) => prev + 1);
    } catch (error) {
      console.error('Error fetching candidates:', error);
    } finally {
      setIsLoading(false);
    }
  }, [page, token, fetchData, isLoading, hasMore]);

  // Reset candidates when token changes
  useEffect(() => {
    if (token) {
      setCandidates([]); // Reset candidates on token change
      setPage(1); // Reset page to 1
      setHasMore(true); // Reset hasMore
      loadMoreData();
    }
  }, [token, loadMoreData]);

  return (
    <Box sx={{ height: 700, width: '100%' }}>
      <InfiniteScroll
        dataLength={candidates.length}
        next={loadMoreData}
        hasMore={hasMore}
        loader={
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
            <CircularProgress size={24} />
          </Box>
        }
        endMessage={
          <Typography sx={{ textAlign: 'center', py: 2, color: 'text.secondary' }}>
            No more candidates to load
          </Typography>
        }
        style={{ overflow: 'visible' }}
      >
        <DataGrid
          rows={candidates}
          columns={columns}
          getRowId={(row) => row._id}
          checkboxSelection={false}
          disableRowSelectionOnClick
          sx={{
            border: '1px solid #e0e0e0',
            borderRadius: 2,
            '& .MuiDataGrid-root': {
              border: 'none',
              borderRadius: 2,
            },
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: 'grey.50',
              borderRadius: '8px 8px 0 0',
            },
            '& .MuiDataGrid-cell': {
              borderBottom: '1px solid #f0f0f0',
            },
            '& .MuiDataGrid-row:hover': {
              backgroundColor: 'grey.50',
            },
          }}
        />
      </InfiniteScroll>
    </Box>
  );
};

export default InfiniteScrollDataGrid;