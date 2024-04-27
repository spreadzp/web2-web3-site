import React, { useCallback, useState } from 'react';
import type { TableData } from '../interfaces/components.itypes';
import Table from './Table';
import { getIconByName } from './Icons';
import { Tooltip } from 'react-tooltip';
import type { TBAccountParams } from '@tokenbound/sdk';
import { useTbaSiteStore } from '../hooks/store';
import { useAccount } from 'wagmi';
import { createPublicClient, custom } from 'viem';
import { bscTestnet } from 'viem/chains';
import { getFullBalance } from '../hooks/parserScan';
import * as ACCOUNT_CONTRACT from "../app/ABIs/Account.sol/Account.json";
import * as ACCOUNT_REGISTRY_CONTRACT from "../app/ABIs/AccountRegistry.sol/AccountRegistry.json";
import { ethers } from "ethers";
import { getProvider } from '../hooks/useEthersSigner';


// eslint-disable-next-line
async function getBalance(contractAddress: string, nftId: string) {
    return {
        erc20s: [
            {
                contractAddress: '0x95413c4f761371274bdbe76e5fd6d4ddbb4870f9',
                balance: '555533.0',
                name: 'Site Token',
                symbol: 'STKN',
            },
        ],
        erc721s: [
            {
                contractAddress: '0xfd8d7f61c16c65025b8308d97151eaa904ebb7e1',
                nftId: 1e-18,
                uri: 'https://sites.gnfd-testnet-sp3.bnbchain.org/tic-tac-toe.html?Authorization=GNFD1-EDDSA%2CSignature%3D079b142d1a55ca38608071d9e456c7a8f998a7c2dd763155eed68c53d7c85f9d02475638513fd3e81e0116cfd19a001081d1e22df4cef9709db9518607863644&X-Gnfd-App-Domain=https%3A%2F%2Ftestnet.dcellar.io&X-Gnfd-Expiry-Timestamp=2024-02-07T06%3A21%3A13.853Z&X-Gnfd-User-Address=0xe3821b4Ab191d0E776b108Ea3bFb395286CB7010&view=1',
                name: '2-D-games',
                symbol: 'GAME',
            },
        ],
        ethBalance: '0.001',
    };
}

interface Balance {
    erc20s: Array<{ contractAddress: string; balance: string; name: string; symbol: string }>;
    erc721s: Array<{ contractAddress: string; nftId: number; uri: string; name: string; symbol: string }>;
    ethBalance: string;
}

const TBA: React.FC = () => {

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



    if (!publicClient) {
        const client = createPublicClient({
            chain: bscTestnet,
            transport: custom(browserWeb3Provider!),
        });
        setPublicClient(client);
    }

    const [retrievedAccount, setRetrievedAccount] = useState<string>("");

    // eslint-disable-next-line
    const [tokenId] = useState("0");
    // eslint-disable-next-line
    //const [menu] = useState(initMenu);
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
    const [nftContractAddress, setNftContractAddress] = useState('');
    const [nftId, setNftId] = useState('');
    const [balance, setBalance] = useState<Balance | null>(null);

    const handleSubmit = async () => {
        const balanceData = await getBalance(nftContractAddress, nftId);
        setBalance(balanceData);
    };

    const getAccount = async () => {
        if (!TBAccount.tokenId) {
            return setError({
                isError: true,
                reason: "tokenId undefined",
            });
        }
        try {
            if (!publicClient) return;

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

        // setRetrievedAccount("");
        // setTBAccount(DEFAULT_ACCOUNT);
        setError({ isError: false, reason: "" });
        setNftContractAddress('');
        setNftId('');
    };

    const checkBalance = useCallback(async () => {
        if (retrievedAccount as `0x${string}`) {
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

    const renderLinkUri = (uri: string) => {
        return (<a href={uri} target="_blank" rel="noopener noreferrer" className='text-blue-500'>Link</a>);
    }
    const renderBalanceTable = () => {
        if (!balance) return null;
        const coinData: TableData[] = [{ id: 1, address: 'ETH', amount: parseFloat(balance.ethBalance) }];
        const tokenData: TableData[] = balance.erc20s.map((token, index) => ({
            id: index + 2,
            address: token.contractAddress,
            name: token.name,
            amount: parseFloat(token.balance),
        }));
        const nftData: TableData[] = balance.erc721s.map((nft, index) => ({
            id: index + balance.erc20s.length + 2,
            name: nft.name,
            uri: renderLinkUri(nft.uri),
            nftId: 0,
            nftMetadata: JSON.stringify(nft.symbol),
        }));



        return <div>
            <Table data={coinData} />
            <Table data={tokenData} />
            <Table data={nftData} />
        </div>;
    };
    return (
        <div className="min-h-screen bg-gradient-to-b from-[#76004f] to-[#4b4fa6]">
            <div className="container mx-auto p-4">
                {balance === null && (
                    <form onSubmit={handleSubmit} className="flex flex-col space-y-4 items-center">
                        <div className="flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0 w-full md:w-1/2">
                            <label className="flex flex-col text-white w-full">
                                NFT Contract Address:
                                <input
                                    type="text"
                                    value={nftContractAddress}
                                    onChange={(e) => setNftContractAddress(e.target.value)}
                                    className="border border-gray-300 p-2 rounded text-black w-full"
                                />
                            </label>
                            <label className="flex flex-col text-white w-full">
                                NFT ID:
                                <input
                                    type="text"
                                    value={nftId}
                                    onChange={(e) => setNftId(e.target.value)}
                                    className="border border-gray-300 p-2 rounded text-black w-full"
                                />
                            </label>
                        </div>
                        <div className="flex flex-col md:flex-row md:space-x-4 w-full md:w-1/2">
                            <button
                                type="button"
                                className="flex-1 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                onClick={() => resetAccount()}
                            >
                                Reset
                            </button>
                            <button
                                type="submit"
                                className="flex-1 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            >
                                Check TBA
                            </button>
                        </div>

                    </form>
                )}
                {balance && (
                    <>
                        <button
                            onClick={() => setBalance(null)}
                            data-tooltip-id="back-tooltip"
                            data-tooltip-content={'Back to Inputs'}
                            className="flex items-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        >
                            {getIconByName('Back')}
                        </button>
                        {renderBalanceTable()}
                    </>
                )}{!balance && nftContractAddress && nftId && (
                    <>

                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full md:w-auto">
                            Create TBA
                        </button>
                    </>
                )}

                <Tooltip id="back-tooltip" />
            </div>
        </div>
    );
};

export default TBA;