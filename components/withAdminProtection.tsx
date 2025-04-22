import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import FormSkeleton from './FormSkeleton';


const withAdminAuth = (WrappedComponent: React.ComponentType) => {
  const ComponentWithAuth = (props: any) => {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const role = localStorage.getItem('role');
      if (role === 'candidate') {
        router.replace('/');
      } else {
        setLoading(false);
      }
    }, [router]);

    if (loading) {
      return <FormSkeleton />;
    }

    return <WrappedComponent {...props} />;
  };

  return ComponentWithAuth;
};

export default withAdminAuth;