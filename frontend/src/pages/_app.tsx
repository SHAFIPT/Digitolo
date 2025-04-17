import { AppProps } from 'next/app';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import '../styles/globals.css';
import '../styles/auth.css';
import '../styles/Controls.css';
import '../styles/EvolutionCelebration.css'
import '../styles/PetDisplay.css'
import '../styles/Home.css'
import '../styles/loading.css'
import { store } from '@/store/store';

function MyApp({ Component, pageProps }: AppProps) {
  // No need for isClient state, just render the Provider directly
  return (
    <Provider store={store}>
      <Toaster position="top-right" />
      <Component {...pageProps} />
    </Provider>
  );
}

export default MyApp;