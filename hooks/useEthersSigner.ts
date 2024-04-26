// import { type WalletClient, useWalletClient } from "wagmi";
import { ethers } from "ethers";

// Ethers.js Adapters for Wagmi Wallet Client
// https://wagmi.sh/react/ethers-adapters

// export function walletClientToSigner(walletClient: WalletClient) {
//   const { account, chain, transport } = walletClient
//   const network = {
//     chainId: chain.id,
//     name: chain.name,
//     ensAddress: chain.contracts?.ensRegistry?.address,
//   }
//   const provider = new ethers.providers.Web3Provider(transport, network)
//   const signer = provider.getSigner(account.address)
//   return signer
// }

// /** Hook to convert a viem Wallet Client to an ethers.js Signer. */
// export function useEthersSigner({ chainId }: { chainId?: number } = {}) {
//   const { data: walletClient } = useWalletClient({ chainId })
//   return React.useMemo(
//     () => (walletClient ? walletClientToSigner(walletClient) : undefined),
//     [walletClient],
//   )
// }

export const getProvider = async () => {
  return ethers.getDefaultProvider(
    "https://data-seed-prebsc-1-s1.binance.org:8545"
  );
};
