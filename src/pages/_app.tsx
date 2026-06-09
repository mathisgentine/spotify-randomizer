import type { AppProps } from 'next/app';
import Layout from "../components/ui/layout"; // Adjust path if necessary
import '../styles/globals.css';
import { useEffect } from 'react';
import Head from 'next/head';

export default function App({ Component, pageProps }: AppProps) {

  useEffect(() => {
    const interval = setInterval(async () => {
      const response = await fetch('/api/spotify-refresh-token');
      if (!response.ok) {
        console.error('Token refresh failed');
        clearInterval(interval);
      }
    }, 1000 * 60 * 50); // Refresh every 50 minutes
    return () => clearInterval(interval); // Cleanup
  }, []);

  return (
      <Layout>
        <Head>
        <title>Randomizer</title>
        <meta
          name="description"
          content="Get random song or podcast from Spotify. A fun and easy-to-use Spotify shuffle tool!"
        />
        </Head>
        <Component {...pageProps} />
      </Layout>
  );
}