'use client';

import * as React from 'react';
import {
  RainbowKitProvider,
  getDefaultWallets,
  connectorsForWallets,
} from '@rainbow-me/rainbowkit';
import {
  argentWallet,
  trustWallet,
  ledgerWallet,
} from '@rainbow-me/rainbowkit/wallets';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import {
  arbitrum, 
  bscTestnet,
  goerli,
  mainnet,
  optimism,
  optimismGoerli,
  polygon,
  sepolia, 
} from 'wagmi/chains';

const { chains, publicClient, webSocketPublicClient,  } = configureChains(
  [
    mainnet,
    polygon,
    optimism,
    arbitrum, 
    bscTestnet,
    sepolia,
    goerli,
    optimismGoerli,
    ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === 'true' ? [sepolia] : []),
  ],
  [publicProvider()]
);

const projectId = process.env.NEXT_PUBLIC_RAINBOW_ID as `0x${string}`; 

const { wallets } = getDefaultWallets({
  appName: 'Green site',
  projectId ,
  chains,
});

const demoAppInfo = {
  appName: 'Green site',
};

const connectors = connectorsForWallets([
  ...wallets,
  {
    groupName: 'Other',
    wallets: [
      argentWallet({ projectId, chains }),
      trustWallet({ projectId, chains }),
      ledgerWallet({ projectId, chains }),
    ],
  },
]);

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains} appInfo={demoAppInfo}>
        {mounted && children}
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
