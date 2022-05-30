import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { Web3ReactProvider } from "@web3-react/core"
import { ethers } from "ethers";

const getLibrary = (provider: any) => {
  const library = new ethers.providers.Web3Provider(provider);
  library.pollingInterval = 2000; 
  return library;
};

function MyApp({ Component, pageProps }: AppProps) {
  return <Web3ReactProvider getLibrary={getLibrary}>
    <Component {...pageProps} />
  </Web3ReactProvider>
}

export default MyApp
