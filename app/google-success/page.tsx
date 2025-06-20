'use client';

import React, { Suspense } from 'react';
import GoogleSuccess from './GoogleSuccess';
const GoogleSuccessPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <GoogleSuccess />
    </Suspense>
  );
};

export default GoogleSuccessPage;
