"use client";

import React, { useMemo, useEffect } from "react";
import {
  ConnectionProvider,
  WalletProvider,
  useWallet,
} from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";
import { 
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { supabase } from '@/app/utils/supabaseClient';

// Default styles that can be overridden by your app
import "@solana/wallet-adapter-react-ui/styles.css";

function WalletAutoRegister() {
  const { publicKey, connected } = useWallet();
  useEffect(() => {
    const walletAddress = publicKey?.toString();
    if (connected && walletAddress) {
      (async () => {
        const { data } = await supabase
          .from('users_walletA')
          .select('id')
          .eq('walletaddress', walletAddress)
          .single();
        if (!data) {
          await supabase.from('users_walletA').insert([{ walletaddress: walletAddress }]);
        }
      })();
    }
  }, [connected, publicKey]);
  return null;
}

export default function AppWalletProvider({
    children,
  }: {
    children: React.ReactNode;
  }) {
    const network = WalletAdapterNetwork.Devnet;
    const endpoint = useMemo(() => clusterApiUrl(network), [network]);
    
    // The wallet adapter will automatically detect which wallets are installed
    // Even if we only list these two adapters here, the wallet UI will show
    // all detected wallets that are installed in the browser
    const wallets = useMemo(
      () => [
        new PhantomWalletAdapter(),
        new SolflareWalletAdapter(),
      ],
      [network],
    );
  
    return (
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={wallets} autoConnect>
          <WalletModalProvider>
            <WalletAutoRegister />
            {children}
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    );
  }
  