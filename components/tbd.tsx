"use client";
import { useCallback, useEffect, useState } from "react";
import {
  createPublicClient,
  custom,
} from "viem";
import {
  bscTestnet,
  // mainnet,
  // sepolia,
  // goerli,
  // optimismGoerli,
} from "viem/chains";
import { type TBAccountParams } from "@tokenbound/sdk";
import { useAccount } from "wagmi";
import * as ACCOUNT_CONTRACT from "../app/ABIs/Account.sol/Account.json";
import * as ACCOUNT_REGISTRY_CONTRACT from "../app/ABIs/AccountRegistry.sol/AccountRegistry.json";
import { ethers } from "ethers";
import { getFullBalance } from "../hooks/parserScan";
import { getProvider } from "../hooks/useEthersSigner";
import { useTbaSiteStore } from "../hooks/store";
import type { Nft } from "../interfaces/components.itypes";
import { DropdownMenu } from "./dropdownMenu";
let client: any;
export default function Tbd() {
  const {
    setTbaBalance,
    tbaBalance,
    htmlForFrame,
    publicClient,
    setPublicClient,
    walletClient,
    tokenBoundClient,
  } = useTbaSiteStore();

  const { isConnected, address } = useAccount();
  const browserWeb3Provider =
    typeof window !== "undefined" ? window.ethereum : null;

  const initMenu: Nft[] = [];

  if (!client) {
    client = createPublicClient({
      chain: bscTestnet,
      transport: custom(browserWeb3Provider!),
    });
    setPublicClient(client);
  }

  const [retrievedAccount, setRetrievedAccount] = useState<string>("");

  // eslint-disable-next-line
  const [tokenId] = useState("0");
  // eslint-disable-next-line
  const [menu] = useState(initMenu);
  // eslint-disable-next-line
  const [tokenContract] = useState(
    process.env.NEXT_PUBLIC_NFT_CONTRACT as `0x${string}`
  );
  const DEFAULT_ACCOUNT: TBAccountParams = {
    tokenContract: tokenContract,
    tokenId: tokenId,
  };
  const [balanceNft, setBalanceNft] = useState(
    {} as {
      tokenContract: `0x${string}`;
      tokenId: string;
      chainId: number;
    }
  );
  const [TBAccount, setTBAccount] = useState<TBAccountParams>(DEFAULT_ACCOUNT);
  const [error, setError] = useState<{
    isError: boolean;
    reason: string;
  }>({
    isError: false,
    reason: "",
  });

  const getAccount = async () => {
    if (!TBAccount.tokenId) {
      return setError({
        isError: true,
        reason: "tokenId undefined",
      });
    }
    try {
      if (!publicClient) return;


      debugger;
      const account = await publicClient.readContract({
        address: process.env.NEXT_PUBLIC_REGISTRY_ADDRESS as `0x${string}`,
        abi: ACCOUNT_REGISTRY_CONTRACT.abi,
        functionName: "account",
        args: [TBAccount.tokenContract, TBAccount.tokenId],
      });
      setRetrievedAccount(account as string);

      const currentOwner = await publicClient.readContract({
        address: account as `0x${string}`,
        abi: ACCOUNT_CONTRACT.abi,
        functionName: "owner",
        args: [],
      });
      console.log("🚀 ~ getAccount ~ currentOwner:", currentOwner);
      debugger;
      const isAuthorized = await publicClient.readContract({
        address: account as `0x${string}`,
        abi: ACCOUNT_CONTRACT.abi,
        functionName: "isAuthorized",
        args: [currentOwner],
      });
      const currentProvider = await getProvider();

      const balance = await currentProvider.getBalance(
        account as `0x${string}`
      );
      const transactionCount = await currentProvider.getTransactionCount(
        account as `0x${string}`
      );
      console.log("🚀 ~ getAccount ~ balance:", balance);
      console.log("🚀 ~ getAccount ~ transactionCount:", transactionCount);
      const startBlock = 37854102; // Get latest 1000 transactions
      const endBlock = startBlock + 1;

      const txHashes = [];
      for (
        let blockNumber = startBlock;
        blockNumber <= endBlock;
        blockNumber++
      ) {
        const block = await currentProvider.getBlock(blockNumber);
        console.log("🚀 ~ getAccount ~ block:", block);

        // Filter block's transactions for the target account
        const blockTxs = block?.transactions.filter(async (tx: any) => {
          const recept = await currentProvider.getTransactionReceipt(tx);
          //console.log("🚀 ~ getAccount ~ recept:", recept)
          if (recept?.from === account || recept?.to === account) {
            console.log("@@@@@@recept", recept?.logs);

            console.log("recept?.contractAddress", recept?.contractAddress);
            console.log("first", recept?.hash);
            console.log("getTransaction", await recept?.getTransaction());
          }
        });

        // Extract and add transaction hashes
        if (blockTxs && blockTxs?.length > 0) {
          txHashes.push(...blockTxs?.map((tx) => tx));
        }
      }

      console.log("🚀 ~ getAccount ~ isAuthorized:", isAuthorized);
      const token = await publicClient.readContract({
        address: account as `0x${string}`,
        abi: ACCOUNT_CONTRACT.abi,
        functionName: "token",
        args: [],
      });

      const balanceTba = await getFullBalance(
        account as string,
        walletClient.chain.blockExplorers.etherscan.url,
        //walletClient.chain.rpcUrls.default.http[0]
      ); //'https://testnet.bscscan.com/address/0xe3821b4Ab191d0E776b108Ea3bFb395286CB7010')
      //'https://etherscan.io/nft-transfers?a=0x9bf81cc31d0f1fa7ade83058509a4db154a182a2')
      //   //'https://testnet.bscscan.com/address/0x4c50D7966F9d7f9a5ca332c9524F3710CB516707#nfttransfers') //account  as `0x${string}`)
      if (balanceTba) {
        setTbaBalance(balanceTba);
      }
      const bal = await publicClient.getBalance({
        address: account as `0x${string}`,
      });

      console.log("🚀 ~ getAccount ~ token:", token);
      console.log("🚀 ~ getAccount ~ bal:", Number(bal));
      const provider = new ethers.VoidSigner(currentOwner as `0x${string}`);

      console.log(
        "🚀 ~ getAccount ~ getBalance:",
        await provider.provider?.getBalance(account as `0x${string}`)
      );

      const isDeployed = await tokenBoundClient.checkAccountDeployment({
        accountAddress: account as `0x${string}`,
      });
      console.log("🚀 ~ getAccount ~ isDeployed:", isDeployed);
      setError({ isError: false, reason: "" });
    } catch (err) {
      console.error(err);
      //setRetrievedAccount("");
      setError({
        isError: true,
        reason: JSON.stringify(err),
      });
    }
  };

  const resetAccount = () => {
    setRetrievedAccount("");
    setTBAccount(DEFAULT_ACCOUNT);
    setError({ isError: false, reason: "" });
  };

  const checkBalance = useCallback(async () => {
    if (retrievedAccount as `0x${string}`) {
      debugger;
      const balance = await tokenBoundClient.getNFT({
        accountAddress: process.env.NEXT_PUBLIC_NFT_CONTRACT as `0x${string}`,
      });
      console.log("🚀 ~ checkBalance ~ balance:", balance);
      const isDeployed = await tokenBoundClient.checkAccountDeployment({
        accountAddress: retrievedAccount as `0x${string}`,

      });
      alert(
        `new account: ${retrievedAccount}"🚀 ~ createAccount ~ isDeployed:", ${isDeployed}`
      );

      setBalanceNft(balance);
      if (tbaBalance.erc721s?.length > 0) {
        console.log("🚀 ~ checkBalance ~ tbaBalance:", tbaBalance);
      }
    }
  }, [retrievedAccount, tokenBoundClient, tbaBalance]);

  const createAccount = useCallback(async () => {
    if (!tokenBoundClient || !address) return;
    debugger;
    const createdAccount = await tokenBoundClient.createAccount({
      tokenContract: TBAccount.tokenContract,
      tokenId: TBAccount.tokenId,
      implementationAddress: process.env
        .NEXT_PUBLIC_BSC_TESTNET_IMPL as `0x${string}`,
      registryAddress: process.env
        .NEXT_PUBLIC_REGISTRY_ADDRESS as `0x${string}`,
    });
    console.log(`new account: ${createdAccount}`);
    checkBalance();
  }, [tokenBoundClient, TBAccount, address, checkBalance]);


  useEffect(() => {
    if (tbaBalance.erc721s?.length > 0) {
      tbaBalance.erc721s.map((erc721) => {
        const menuItem: Nft = {
          address: erc721.contractAddress,
          nftId: `${erc721.nftId}`,
          chainId: "97",
          title: erc721.symbol,
          description: erc721.name,
          link: erc721.uri,
        };
        menu.push(menuItem);
      });
      const menuItem: Nft = {
        chainId: "",
        title: 'return to tba',
        description: 'Click here to return to TBA',
        link: '',
      };
      menu.push(menuItem);
    }
  }, [tbaBalance, menu]);
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#76004f] to-[#4b4fa6]">
      <div className="container mx-auto p-4">
        {menu.length > 0 && <DropdownMenu menuItems={menu} />}

        <main className=" flex-col items-center justify-center ">
          {htmlForFrame === "" && isConnected && (<div className="container flex flex-col px-4 py-16 ">

            <div className="grid grid-cols-1 gap-8 text-white ">
              <div>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    getAccount();
                  }}
                  className="grid grid-cols-1 gap-4 md:grid-cols-2"
                >
                  <label htmlFor="nftContract">NFT Contract</label>
                  <input
                    type="text"
                    className="h-fit rounded-lg bg-slate-300 p-2 text-black"
                    id="nftContract"
                    onChange={(event) =>
                      setTBAccount({
                        ...TBAccount,
                        tokenContract: event.target
                          .value as TBAccountParams["tokenContract"],
                      })
                    }
                    value={TBAccount.tokenContract}
                  />

                  <label htmlFor="nftTokenId">Token ID</label>
                  <input
                    type="text"
                    className="h-fit rounded-lg bg-slate-300 p-2 text-black"
                    id="nftTokenId"
                    onChange={(event) =>
                      setTBAccount({
                        ...TBAccount,
                        tokenId: event.target.value,
                      })
                    }
                    value={TBAccount.tokenId}
                  />
                  <button
                    type="submit"
                    className="col-span-2 h-fit self-end rounded-lg bg-slate-100 p-2 text-black"
                  >
                    Check
                  </button>
                </form>

                <div className="grid grid-cols-1 gap-4 font-mono text-white">
                  <pre className="w-full overflow-x-auto">
                    {JSON.stringify(
                      { ...TBAccount, retrievedAccount, error },
                      null,
                      2
                    )}
                  </pre>
                  <div> Balance TBA</div>
                  <pre>{JSON.stringify(tbaBalance)}</pre>
                  {tbaBalance.erc721s?.length > 0 && (
                    <div>
                      <div>ERC20 Balance</div>
                      <pre>{JSON.stringify(tbaBalance.erc20s)}</pre>
                      <div>NFTs Balance</div>
                      <pre>{JSON.stringify(tbaBalance.erc721s)}</pre>
                      <div>Coin Balance</div>
                      <pre>{JSON.stringify(tbaBalance.ethBalance)}</pre>
                    </div>
                  )}
                  <pre className="w-full overflow-x-auto">
                    {JSON.stringify(balanceNft)}
                  </pre>
                  <button
                    type="button"
                    className="rounded-lg bg-slate-100 p-2 text-black"
                    onClick={resetAccount}
                  >
                    Reset
                  </button>
                  <button
                    type="button"
                    className="rounded-lg bg-slate-100 p-2 text-black"
                    onClick={() => createAccount()}
                  >
                    createAccount
                  </button>
                  <button
                    type="button"
                    className="rounded-lg bg-slate-100 p-2 text-black"
                    onClick={() => checkBalance()}
                  >
                    Check balance
                  </button>
                </div>
              </div>

            </div>

          </div>)}
          <div className=" container  ">
            {htmlForFrame !== "" && (
              <iframe
                srcDoc={htmlForFrame}
                title="Remote Content"
                className="iframe-content"
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
