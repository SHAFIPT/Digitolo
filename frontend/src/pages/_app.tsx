import { AppProps } from 'next/app';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { useEffect, useState } from 'react';
import '../styles/globals.css';
import '../styles/auth.css';
import '../styles/Controls.css';
import '../styles/EvolutionCelebration.css'
import '../styles/PetDisplay.css'
import '../styles/Home.css'
import '../styles/loading.css'
import { store } from '@/store/store';

function MyApp({ Component, pageProps }: AppProps) {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <>
      {isClient ? (
        <Provider store={store}>
          <Toaster position="top-right" />
          <Component {...pageProps} />
        </Provider>
      ) : (
        // Simple loading state or SSR-safe version
        <div>Loading...</div>
      )}
    </>
  );
}

export default MyApp;