import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const withAdminAndEmployerAuth = (WrappedComponent: React.ComponentType) => {
  return (props: any) => {
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

    useEffect(() => {
      const token = localStorage.getItem('token');
      const userRole = localStorage.getItem('role');

      if (!token) {
        router.push('/login');
      } else if (userRole !== 'admin' && userRole !== 'employer') {
        setIsAuthorized(false);
      } else {
        setIsAuthorized(true);
      }
    }, [router]);

    if (isAuthorized === null) {
      return <p>Checking authorization...</p>;
    }

    if (isAuthorized === false) {
      return <p style={{ color: 'red', textAlign: 'center', marginTop: '2rem' }}>
        ❌ You are not authorized to access this page.
      </p>;
    }

    return <WrappedComponent {...props} />;
  };
};

export default withAdminAndEmployerAuth;
