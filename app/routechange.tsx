'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

export function RouteChangeListener() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'; 
  const sanitised_path = usePathname();
  const [changes, setChanges] = useState(0);

  useEffect(() => {
    const gaValue = Cookies.get('_ga');  // Get the _ga cookie value

    console.log(`Route changed to: ${sanitised_path}`);
    console.log(`_ga Cookie Value: ${gaValue}`);

    // Async function to call the API and handle the response
    const trackActivity = async () => {
      // Check that pathname is not null and does not contain "/api"
      if (gaValue && sanitised_path && !sanitised_path.includes('/api')) {
        try {
          const response = await fetch(`${baseUrl}/api/trackActivity`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ gaValue, sanitised_path }),
          });

          // Check if the response is not OK (status code outside 200-299)
          if (!response.ok) {
            const errorDetails = await response.text(); // Get the full error message from the response
            console.error('API Error:', {
              status: response.status,
              statusText: response.statusText,
              errorDetails,
            });
            throw new Error(`Error ${response.status}: ${response.statusText}`);
          }

          const data = await response.json();
          console.log('API Response:', data);
          
          // Handle the response data if needed
        } catch (error) {
          console.error('Caught Error:', error);
        }
      }
    };

    // Call the async function
    trackActivity();

    // Increment the changes counter
    setChanges((prev) => prev + 1);
  }, [sanitised_path]);

  return null;
}
