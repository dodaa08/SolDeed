declare module '@solana/wallet-adapter-react' {
  import { FC, ReactNode } from 'react';
  import { PublicKey } from '@solana/web3.js';
  
  export interface ConnectionProviderProps {
    children: ReactNode;
    endpoint: string;
  }
  
  export interface WalletProviderProps {
    children: ReactNode;
    wallets: any[];
    autoConnect?: boolean;
  }
  
  export interface WalletContextState {
    wallet: any | null;
    adapter: any | null;
    publicKey: PublicKey | null;
    connecting: boolean;
    connected: boolean;
    disconnecting: boolean;
    connect: () => Promise<void>;
    disconnect: () => Promise<void>;
    select: (walletName: string) => void;
    wallets: any[];
  }
  
  export interface WalletProviderProps {
    children: ReactNode;
    wallets: any[];
    autoConnect?: boolean;
  }
  
  export const useWallet: () => WalletContextState;
  export const ConnectionProvider: FC<ConnectionProviderProps>;
  export const WalletProvider: FC<WalletProviderProps>;
}

declare module '@solana/wallet-adapter-base' {
  export enum WalletAdapterNetwork {
    Mainnet = 'mainnet-beta',
    Testnet = 'testnet',
    Devnet = 'devnet'
  }
  
  export interface Wallet {
    adapter: any;
    readyState: any;
  }
}

declare module '@solana/wallet-adapter-react-ui' {
  import { FC, ReactNode, CSSProperties } from 'react';
  
  export interface WalletModalProviderProps {
    children: ReactNode;
  }
  
  export const WalletModalProvider: FC<WalletModalProviderProps>;
  
  export interface WalletMultiButtonProps {
    children?: ReactNode;
    style?: CSSProperties;
    className?: string;
  }
  
  export const WalletMultiButton: FC<WalletMultiButtonProps>;
}

declare module '@solana/wallet-adapter-wallets' {
  import { Wallet } from '@solana/wallet-adapter-base';
  
  export class PhantomWalletAdapter implements Wallet {
    constructor();
    adapter: any;
    readyState: any;
  }
  
  export class SolflareWalletAdapter implements Wallet {
    constructor();
    adapter: any;
    readyState: any;
  }
}

declare module '@solana/web3.js' {
  export class PublicKey {
    constructor(value: string | number[] | Uint8Array);
    toString(): string;
    toBytes(): Uint8Array;
    equals(publicKey: PublicKey): boolean;
  }
  
  export function clusterApiUrl(network: string): string;
} 