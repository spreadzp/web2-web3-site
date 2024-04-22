"use client";
import { TokenboundClient } from "@tokenbound/sdk";
import { createWalletClient, custom } from "viem";
import { bscTestnet } from "viem/chains";
import { useAccount } from "wagmi";
import { useTbaSiteStore } from "./store";
import { useCallback } from "react";

export const WalletInstallation = () => {
  const { setTokenboundClient, setWalletClient } = useTbaSiteStore();
  const { address } = useAccount();
  //   const { connect } = useConnect();
  //   const { disconnect } = useDisconnect();
  //   const { switchNetwork } = useSwitchNetwork();
  const initWalletClient = useCallback(() => {
    const browserWeb3Provider =
      typeof window !== "undefined" ? window.ethereum : null;
    const walletClient = createWalletClient({
      account: address,
      chain: bscTestnet, // optimismGoerli,
      transport: custom(browserWeb3Provider!),
      //transport: http(),
    });

    setWalletClient(walletClient);
    const tokenboundClient = new TokenboundClient({
      chain: bscTestnet,
      walletClient,
      implementationAddress: process.env
        .NEXT_PUBLIC_BSC_TESTNET_IMPL as `0x${string}`,
      registryAddress: process.env
        .NEXT_PUBLIC_REGISTRY_ADDRESS as `0x${string}`,
    });
    setTokenboundClient(tokenboundClient);
  }, [setTokenboundClient, setWalletClient, address]);

  return (<>
  {initWalletClient()}
  </>)

};
