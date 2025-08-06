import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { UserType } from '@/types/types';

export const useRedirectIfAuthenticated = (user: UserType) => {
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);
};
