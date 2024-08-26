'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

export function RouteChangeListener() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'; 
  const pathname = usePathname();
  const [changes, setChanges] = useState(0);

  useEffect(() => {
    const _ga = Cookies.get('_ga');  // Get the _ga cookie value

    console.log(`Route changed to: ${pathname}`);
    console.log(`_ga Cookie Value: ${_ga}`);

    // Update the if condition to check that pathname is not null and does not contain "/api"
    if (_ga && pathname) {
      fetch(`${baseUrl}/api/trackActivity`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pathname,
          _ga,
          baseUrl
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log('API Response:', data);

          // Extract mostVisitedPage and pageVisitedCount from the API response
          const { mostVisitedPage, pageVisitedCount } = data;

          // Save the API response data in cookies
          if (mostVisitedPage) {
            Cookies.set('mostVisitedPage', mostVisitedPage, { expires: 7 });
          }
          if (pageVisitedCount) {
            Cookies.set('pageVisitedCount', pageVisitedCount, { expires: 7 });
          }

          console.log(`Most Visited Page: ${mostVisitedPage}`);
          console.log(`Page Visited Count: ${pageVisitedCount}`);
        })
        .catch((error) => console.error('API Error:', error));
    }

    setChanges((prev) => prev + 1);
  }, [pathname]);

  return null;
}
