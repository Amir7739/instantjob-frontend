import { Suspense } from "react";
import { SearchJobs } from "@/components/SearchJobs";
import { SkeletonLoader } from "@/components/SkeletonLoader"; // Adjust the import path as needed

const SearchJob = () => {
  return (
    <main>
      <Suspense fallback={<SkeletonLoader count={9} />}>
        <SearchJobs />
      </Suspense>
    </main>
  );
};

export default SearchJob;

// Ensure the page is dynamic to handle query parameters
export const dynamic = "force-dynamic";