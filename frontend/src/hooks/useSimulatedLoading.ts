// hooks/useSimulatedLoading.ts
import { useEffect } from 'react';

export const useSimulatedLoading = (setLoading: (value: boolean) => void, duration: number = 2000) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [setLoading, duration]);
};
