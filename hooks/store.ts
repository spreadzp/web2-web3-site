import type { TokenboundClient } from "@tokenbound/sdk";
import type { TBAccountParams } from '@tokenbound/sdk';
import type { PublicClient, WalletClient } from "viem";
import { create } from "zustand";
export type ERC721Param = {
  contractAddress: string;
  nftId?: number;
  uri: string;
  name: string;
  symbol: string;
};

export type ERC20Param = {
  contractAddress: string;
  balance: string;
  name: string;
  symbol: string;
};
export type Balance = {
  ethBalance: string;
  erc20s: ERC20Param[];
  erc721s: ERC721Param[];
};
type Menu = {};
interface ITbaSite {
  menu: Menu;
  setMenu: (menu: Menu) => void;
  tbaBalance: Balance;
  setTbaBalance: (tbaBalance: Balance) => void;
  htmlForFrame: string;
  setHtmlForFrame: (uri: string) => void;
  publicClient: PublicClient;
  setPublicClient: (client: PublicClient) => void;
  selectedNft: Nft;
  setSelectedNft: (nft: Nft) => void;
  tokenBoundClient: TokenboundClient;
  setTokenBoundClient: (client: TokenboundClient) => void;
  walletClient: WalletClient;
  setWalletClient: (client: WalletClient) => void;
  TBAccount: TBAccountParams;
  setTBAccount: (TBAccount: TBAccountParams) => void;
  retrievedAccount: string;
  setRetrievedAccount: (account: string) => void;
}

type Nft = {
  address: string;
  nftId: string;
  chainId?: string;
  link?: string;
  title?: string;
  description?: string;
};


export const useTbaSiteStore = create<ITbaSite>((set) => ({
  menu: {} as Menu,
  setMenu: (menu: Menu) => set({ menu }),
  tbaBalance: {} as Balance,
  setTbaBalance: (balance: Balance) => set({ tbaBalance: balance }),
  htmlForFrame: "",
  setHtmlForFrame: (uri: string) => set({ htmlForFrame: uri }),
  publicClient: {} as PublicClient,
  setPublicClient: (client: PublicClient) => set({ publicClient: client }),
  selectedNft: {} as Nft,
  setSelectedNft: (nft: Nft) => set({ selectedNft: nft }),
  tokenBoundClient: {} as TokenboundClient,
  setTokenBoundClient: (client: TokenboundClient) =>
    set({ tokenBoundClient: client }),
  walletClient: {} as WalletClient,
  setWalletClient: (client: WalletClient) => set({ walletClient: client }),
  TBAccount: {} as TBAccountParams,
  setTBAccount: (TBAccount: TBAccountParams) => set({ TBAccount: TBAccount }),
  retrievedAccount: "",
  setRetrievedAccount: (account: string) => set({ retrievedAccount: account }),
}));
