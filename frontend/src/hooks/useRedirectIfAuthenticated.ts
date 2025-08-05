import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { UserType } from '@/context/auth-context';

export const useRedirectIfAuthenticated = (user: UserType) => {
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);
};
