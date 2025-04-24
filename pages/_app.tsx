
import './styles/globals.css'; // Make sure this path matches your folder structure
import type { AppProps } from 'next/app';

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
