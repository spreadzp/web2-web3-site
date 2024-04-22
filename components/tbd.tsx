"use client";
import { useCallback, useEffect, useState } from "react";
import {
  http,
  createWalletClient,
  createPublicClient,
  custom,
  parseAbi,
  type PublicClient,
} from "viem";
import {
  bscTestnet,
  mainnet,
  sepolia,
  goerli,
  optimismGoerli,
} from "viem/chains";
import { type TBAccountParams, TokenboundClient } from "@tokenbound/sdk";
//import { type TBAccountParams } from "@tokenbound/sdk/dist/src/TokenboundClient";
import { useAccount } from "wagmi";
import Iframe from "react-iframe";
import * as NFT_CONTRACT from "../app/ABIs/nft.sol.json";
import * as ACCOUNT_CONTRACT from "../app/ABIs/Account.sol/Account.json";
import * as ACCOUNT_REGISTRY_CONTRACT from "../app/ABIs/AccountRegistry.sol/AccountRegistry.json";
import { proxyUrl } from "../hooks/proxyUrl";
import { FiBox } from "react-icons/fi";
import { FaBars } from "react-icons/fa";
import { ethers } from "ethers";
import { getFullBalance } from "../hooks/parserScan";
import { getProvider } from "../hooks/useEthersSigner";
import { useTbaSiteStore } from "../hooks/store";
import type { Nft } from "../interfaces/components.itypes";
import { DropdownMenu } from "./dropdownMenu";
import { WalletInstallation } from "../hooks/walletInstallation";
let client: any;
export default function Tbd() {
  const {
    setTbaBalance,
    tbaBalance,
    htmlForFrame,
    setHtmlForFrame,
    publicClient,
    setSelectedNft,
    selectedNft,
    setPublicClient,
    walletClient,
    tokenboundClient,
  } = useTbaSiteStore();

  const { isConnected, address } = useAccount();
  const browserWeb3Provider =
    typeof window !== "undefined" ? window.ethereum : null;
  // const walletClient = createWalletClient({
  //   account: address,
  //   chain: bscTestnet, // optimismGoerli,
  //   transport: custom(browserWeb3Provider!),
  //    //transport: http(),
  // });

  const initMenu: Nft[] = [
    {
      address: "0xfd8D7f61C16C65025b8308d97151eaa904eBB7E1",
      nftId: "0",
      chainId: "97",
      title: "title 1",
      description: "description 1",
    },
    {
      address: "0xF4F3A96C24117582316197C4bf0af6c7a2A9571D",
      nftId: "0",
      chainId: "97",
      title: "title 2",
      description: "description 2",
    },
    {
      address: "0xDDBABEAef71416c4273928Aa88b661DddCce33f5",
      nftId: "2",
      chainId: "97",
      title: "title 3",
      description: "description 3",
    },
  ];

  if (!client) {
    client = createPublicClient({
      chain: bscTestnet,
      transport: custom(browserWeb3Provider!),
    });
    setPublicClient(client);
  }

  // publicClientRPCUrl: process.env.NEXT_PUBLIC_GOERLI_RPC_URL,
  // const tokenboundClient = new TokenboundClient({
  //   walletClient,
  //   chain: bscTestnet,
  //   implementationAddress: process.env.NEXT_PUBLIC_BSC_TESTNET_IMPL as `0x${string}`,
  //   registryAddress: process.env.NEXT_PUBLIC_REGISTRY_ADDRESS as `0x${string}`
  // }); // ,  publicClient: client

  const [retrievedAccount, setRetrievedAccount] = useState<string>("");

  const [tokenId, setTokenId] = useState("0");
  const [menu, setMenu] = useState(initMenu);
  const [tokenContract, setTokenContract] = useState(
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
      //if(!publicClient) return
      //const account = tokenboundClient.getAccount(TBAccount);
      // const currentOwner = await publicClient.readContract({
      //   address: process.env.NEXT_PUBLIC_BSC_TESTNET_IMPL as `0x${string}`,
      //   abi: ACCOUNT_CONTRACT.abi,
      //   functionName: "owner",
      //   args: [],
      // });
      // console.log("🚀 ~ getAccount ~ currentOwner:", currentOwner)

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
        walletClient.chain.rpcUrls.default.http[0]
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
      // console.log(

      //   "tokenboundClient.publicClient.chain()",
      //   tokenboundClient.publicClient.chain
      // );
      // const isDeployed = await tokenboundClient.checkAccountDeployment({
      //   accountAddress: account,
      // });
      // console.log("🚀 ~ getAccount ~ isDeployed:", isDeployed);
      setError({ isError: false, reason: "" });
    } catch (err) {
      console.error(err);
      setRetrievedAccount("");
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

  const createAccount = useCallback(async () => {
    if (!tokenboundClient || !address) return;
    debugger;
    const createdAccount = await tokenboundClient.createAccount({
      tokenContract: TBAccount.tokenContract,
      tokenId: TBAccount.tokenId,
      implementationAddress: process.env
        .NEXT_PUBLIC_BSC_TESTNET_IMPL as `0x${string}`,
      registryAddress: process.env
        .NEXT_PUBLIC_REGISTRY_ADDRESS as `0x${string}`,
    });
    console.log(`new account: ${createdAccount}`);
    checkBalance();
  }, [tokenboundClient, TBAccount]);

  const checkBalance = useCallback(async () => {
    if (retrievedAccount as `0x${string}`) {
      debugger;
      const balance = await tokenboundClient.getNFT({
        accountAddress: process.env.NEXT_PUBLIC_NFT_CONTRACT as `0x${string}`,
      });
      console.log("🚀 ~ checkBalance ~ balance:", balance);
      const isDeployed = await tokenboundClient.checkAccountDeployment({
        accountAddress: retrievedAccount as `0x${string}`,
        // process.env
        //   .NEXT_PUBLIC_TOKEN_BOUND_ACCOUNT as `0x${string}`,
      });
      alert(
        `new account: ${retrievedAccount}"🚀 ~ createAccount ~ isDeployed:", ${isDeployed}`
      );

      setBalanceNft(balance);
      if (tbaBalance.erc721s?.length > 0) {
      }
    }
  }, [retrievedAccount, tokenboundClient]);

  // const DropdownMenu = ({ menuItems}: { menuItems: Nft[] } ) => {
  //   const [isOpen, setIsOpen] = useState(false);

  //   const toggleMenu = () => {
  //     setIsOpen(!isOpen);
  //   };
  //   return (
  //     <div className="dropdown-menu" >
  //       <div className="dropdown-toggle" onClick={toggleMenu}>
  //       <FaBars color="red" size={20}/>
  //       </div>
  //       {isOpen && (
  //         <ul className={`dropdown-list ${isOpen ? 'open' : ''}`}>
  //           {menuItems.map((menuItem, index) => (
  //             <li key={index} onClick={() => getPageFromNftUri(menuItem)}>
  //               <div className="item-icon">{menuItem.chainId}</div>
  //               <div className="item-title">{menuItem.title}</div>
  //               <div className="item-nftId">{menuItem.nftId}</div>
  //               <div className="item-description">{menuItem.description}</div>
  //             </li>
  //           ))}
  //         </ul>
  //       )}
  //     </div>
  //   );
  // };
  return (
    <>
      <WalletInstallation />
      {isConnected && (
        <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#76004f] to-[#15162c]">
          <div className="container flex flex-col gap-12 px-4 py-16 ">
            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-[3rem]">
              <DropdownMenu menuItems={menu} />
              Check{" "}
              <span className="text-[hsl(187,100%,68%)]">
                tokenbound account
              </span>{" "}
              for any NFT
            </h1>
            <div className="rounded-xl border-2 border-white p-4 text-white">
              Use the{" "}
              <a
                // href="https://tokenbound.org"
                target="_blank"
                className="underline"
              >
                tokenbound explorer ↗️
              </a>{" "}
              to explore NFTs and their wallets.
            </div>
            <div className="grid grid-cols-1 gap-8 text-white md:grid-cols-2">
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
              <div className="iframe-container">
                {htmlForFrame !== "" && (
                  <iframe
                    srcDoc={htmlForFrame}
                    title="Remote Content"
                    className="iframe-content"
                  />
                )}
              </div>
            </div>
          </div>
        </main>
      )}
    </>
  );
}
