// _app.tsx
import { CookiesProvider } from 'next-client-cookies/server';

function MyApp({ Component, pageProps }) {
  return (
    <CookiesProvider>
      <Component {...pageProps} />
    </CookiesProvider>
  );
}

export default MyApp;
