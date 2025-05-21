// app/jobs/create/page.tsx
'use client'

import React from "react";
import JobCreateForm from "@/components/JobCreateForm";
import withAdminAndEmployerAuth from "@/components/withAdminAndEmployerProtection";


const JobCreatePage = () => {
  return (
    <main>
      <JobCreateForm />
    </main>
  );
};

export default withAdminAndEmployerAuth(JobCreatePage);