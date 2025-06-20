'use client';

import React, { Suspense } from 'react';
import ResetPasswordPage from './ResetPasswordPage';

const ResetPasswordPageWrapper = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordPage />
    </Suspense>
  );
};

export default ResetPasswordPageWrapper;
