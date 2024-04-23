"use client";
import { TokenboundClient } from "@tokenbound/sdk";
import { createWalletClient, custom } from "viem";
import { bscTestnet } from "viem/chains";
import { useAccount } from "wagmi";
import { useTbaSiteStore } from "./store";
import { useCallback, useEffect } from "react";

export function WalletInstallation() {
  const { setTokenBoundClient, setWalletClient } = useTbaSiteStore();
  const { address } = useAccount();
  //   const { connect } = useConnect();
  //   const { disconnect } = useDisconnect();
  //   const { switchNetwork } = useSwitchNetwork();
  useEffect(() => {
    initWalletClient();
  });
  const initWalletClient = useCallback(() => {
    const browserWeb3Provider =
      typeof window !== "undefined" ? window.ethereum : null;
    const client = createWalletClient({
      account: address,
      chain: bscTestnet, // optimismGoerli,
      transport: custom(browserWeb3Provider!),
      //transport: http(),
    });
    console.log("client", client);
    setWalletClient(client);
    const tokenBoundClient = new TokenboundClient({
      chain: bscTestnet,
      walletClient: client as any,
      implementationAddress: process.env
        .NEXT_PUBLIC_BSC_TESTNET_IMPL as `0x${string}`,
      registryAddress: process.env
        .NEXT_PUBLIC_REGISTRY_ADDRESS as `0x${string}`,
    });
    setTokenBoundClient(tokenBoundClient);
  }, [setTokenBoundClient, setWalletClient, address]);

  return <></>;
}
