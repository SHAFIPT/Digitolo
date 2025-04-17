import { AppProps } from 'next/app';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import '../styles/globals.css';
import { store } from '@/store/store';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}> {/* Wrap your app in the Provider */}
      <Toaster position="top-right" />
      <Component {...pageProps} />
    </Provider>
  );
}

export default MyApp;
