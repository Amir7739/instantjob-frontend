// app/jobs/create/page.tsx
'use client'

import React from "react";
import JobCreateForm from "@/components/JobCreateForm";
import withAdminAuth from "@/components/withAdminProtection";


const JobCreatePage = () => {
  return (
    <main>
      <JobCreateForm />
    </main>
  );
};

export default withAdminAuth(JobCreatePage);
