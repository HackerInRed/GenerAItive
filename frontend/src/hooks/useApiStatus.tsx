
import { useState, useCallback, useEffect } from 'react';

export const useApiStatus = () => {
  const [isApiAvailable, setIsApiAvailable] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  
  const checkApiStatus = useCallback(async () => {
    // Skip if we're already checking to prevent multiple simultaneous requests
    if (isChecking) return;
    
    setIsChecking(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
      
      const response = await fetch(`${apiUrl}/jobs`, { 
        method: 'GET',
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        setIsApiAvailable(true);
        console.log('Backend API is available');
      } else {
        setIsApiAvailable(false);
        console.log('Backend API returned error:', response.status);
      }
    } catch (error) {
      setIsApiAvailable(false);
      if (error instanceof Error) {
        console.log('Backend API is not available:', error.message);
      } else {
        console.log('Backend API is not available, unknown error');
      }
    } finally {
      setIsChecking(false);
    }
  }, [isChecking]);
  
  // Initial check on mount
  useEffect(() => {
    checkApiStatus();
  }, [checkApiStatus]);
  
  return { isApiAvailable, checkApiStatus };
};
