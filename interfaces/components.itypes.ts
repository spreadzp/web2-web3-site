export type Nft = {
  address?: string;
  nftId?: string;
  chainId?: string;
  link?: string | React.JSX.Element;
  title?: string;
  description?: string;
};

export type CoinData = {
  id: number;
  address: string;
  amount: number;
};

export type TokenData = {
  id: number;
  address: string;
  name: string;
  amount: number;
};

export type NFTData = {
  id: number;
  name: string;
  uri: string | React.JSX.Element;
  price?: number;
  seller?: string;
  buyer?: string;
  nftMetadata: string;
};

// This type can be extended to include other types of data
export type TableData = CoinData | TokenData | NFTData;
