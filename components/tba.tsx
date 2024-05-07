'use client';
import React, { useCallback, useEffect, useState } from 'react';
import type { TableData } from '../interfaces/components.itypes';
import Table from './Table';
import { getIconByName } from './Icons';
import { Tooltip } from 'react-tooltip';
import type { TBAccountParams } from '@tokenbound/sdk';
import { useTbaSiteStore, type Balance } from '../hooks/store';
import { useAccount } from 'wagmi';
import { createPublicClient, createWalletClient, custom } from 'viem';
import { bscTestnet } from 'viem/chains';
import { getFullBalance } from '../hooks/parserScan';
import * as ACCOUNT_REGISTRY_CONTRACT from "../app/ABIs/artifacts/AccountRegistry.json";


const TBA: React.FC = () => {
    //const [url, setUrl] = useState('');
    const {
        setTbaBalance,
        publicClient,
        setPublicClient,
        walletClient,
        tokenBoundClient,
        TBAccount, setTBAccount,
        setWalletClient
    } = useTbaSiteStore();

    const { address } = useAccount();
    const browserWeb3Provider =
        typeof window !== "undefined" ? window.ethereum : null;

    const [retrievedAccount, setRetrievedAccount] = useState<string>("");

    // eslint-disable-next-line
    const [tokenId] = useState("2");
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


    const [isTbaDeployed, setIsTbaDeployed] = useState(false);
    const [isTbaCreate, setIsTbaCreate] = useState(false);
    const [error, setError] = useState<{
        isError: boolean;
        reason: string;
    }>({
        isError: false,
        reason: "",
    });


    useEffect(() => {
        setTBAccount(DEFAULT_ACCOUNT);
        // eslint-disable-next-line
    }, []);

    const [balance, setBalance] = useState<Balance | null>(null);

    const initPublicClient = useCallback(() => {
        const client = createPublicClient({
            chain: bscTestnet,
            transport: custom(browserWeb3Provider!),
        });
        setPublicClient(client);

    }, [browserWeb3Provider, setPublicClient,])


    const initWalletClient = useCallback(() => {
        const client = createWalletClient({
            chain: bscTestnet,
            transport: custom(browserWeb3Provider!),
        });
        setWalletClient(client);

    }, [browserWeb3Provider, setWalletClient])

    if (!publicClient.readContract) {
        initPublicClient();
    };
    if (!walletClient.writeContract) {
        initWalletClient();
    };

    const resetAccount = () => {

        setRetrievedAccount("");
        setTBAccount({ tokenContract: "0x0", tokenId: "" });
        setError({ isError: false, reason: "" });
        setIsTbaDeployed(false);
        setIsTbaCreate(false);
    };

    const checkDeployTBAccount = useCallback(async () => {
        if (TBAccount.tokenContract as `0x${string}`) {
            if (!publicClient.readContract) {
                initPublicClient();
            };
            if (publicClient.readContract) {
                const account = await publicClient.readContract({
                    address: process.env.NEXT_PUBLIC_REGISTRY_ADDRESS as `0x${string}`,
                    abi: ACCOUNT_REGISTRY_CONTRACT.abi,
                    functionName: "account",
                    args: [TBAccount.tokenContract, TBAccount.tokenId],
                });

                setRetrievedAccount(account as string);
                const isDeployed = await tokenBoundClient.checkAccountDeployment({
                    accountAddress: account as `0x${string}`,

                });

                setIsTbaDeployed(isDeployed);
                setIsTbaCreate(!isDeployed);
                if (isDeployed) {
                    setError({ isError: false, reason: "" });
                }
            }

        } else {
            alert(`'Wrong address format!'${TBAccount.tokenContract}`);
        }
    }, [TBAccount.tokenContract, TBAccount.tokenId, tokenBoundClient, publicClient, initPublicClient]);


    const handleSubmit = useCallback(async () => {
        try {
            await checkDeployTBAccount()
            if (isTbaDeployed) {
                console.log('walletClient?.chain', walletClient?.chain)
                const balanceTba = await getFullBalance(
                    retrievedAccount as string,
                    walletClient?.chain?.blockExplorers?.etherscan.url as string,

                ); //'https://testnet.bscscan.com/address/0xe3821b4Ab191d0E776b108Ea3bFb395286CB7010') 

                if (balanceTba) {
                    setTbaBalance(balanceTba);
                    setBalance(balanceTba);
                }

            }

        } catch (error) {
            setError({ isError: true, reason: JSON.stringify(error) });
            console.log("🚀 ~ getAccount ~ error:", error);
        }
    }, [checkDeployTBAccount, isTbaDeployed, retrievedAccount, walletClient?.chain, setTbaBalance, setBalance]);

    const createAccount = useCallback(async () => {
        if (!tokenBoundClient || !address) return;
        const { request } = await publicClient.simulateContract({
            address: process.env.NEXT_PUBLIC_REGISTRY_ADDRESS as `0x${string}`,
            abi: ACCOUNT_REGISTRY_CONTRACT.abi,
            functionName: "createAccount",
            args: [TBAccount.tokenContract, TBAccount.tokenId],
        });
        const hash = await walletClient.writeContract(request);

        if (hash) {
            setIsTbaCreate(false);
        }
    }, [publicClient, walletClient, TBAccount.tokenContract, TBAccount.tokenId, tokenBoundClient, address]);

    const handleInput = (event: any, inputName: string) => {
        setTBAccount({ ...TBAccount, [inputName]: event.target.value });
    }
    const renderLinkUri = (uri: string) => {
        return (<a href={uri} target="_blank" rel="noopener noreferrer" className='text-blue-500'>Link</a>);
    }
    const renderBalanceTable = () => {
        if (!balance) return null;
        const coinData: TableData[] = [{ '#': 1, symbol: walletClient?.chain?.nativeCurrency.symbol || "ETH", amount: parseFloat(balance.ethBalance) }];
        const tokenData: TableData[] = balance.erc20s.map((token, index) => ({
            '#': index + 2,
            address: token.contractAddress,
            name: token.name,
            amount: parseFloat(token.balance),
        }));
        const nftData: TableData[] = balance.erc721s.map((nft, index) => ({
            '#': index + balance.erc20s.length + 2,
            name: nft.name,
            uri: renderLinkUri(nft.uri),
            symbol: nft.symbol,
            //nftId: nft.nftId,
            nftMetadata: JSON.stringify(nft.symbol),
        }));

        return <div>
            <div className="w-full text-center text-white font-bold mb-4">Balances for Tba account {retrievedAccount} </div>
            <div className="w-full text-center text-white font-bold mb-4"> Created from contract {TBAccount.tokenContract} with nftId {TBAccount.tokenId}</div>
            <div className="w-full text-center text-white font-bold mb-4">Balance in coins</div>
            <Table data={coinData} />
            <div className="w-full text-center text-white font-bold mb-4">Balance in tokens</div>
            <Table data={tokenData} />
            <div className="w-full text-center text-white font-bold mb-4">Balance in NFTs</div>
            <Table data={nftData} />
        </div>;

    };
    return (
        <div className="min-h-screen bg-gradient-to-b from-[#76004f] to-[#4b4fa6]">
            <div className="container mx-auto p-4">
                {balance === null && (
                    <div className="flex flex-col space-y-4 items-center">
                        <div className="flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0 w-full md:w-1/2">
                            <label className="flex flex-col text-white w-full">
                                NFT Contract Address:
                                <input
                                    type="text"
                                    value={TBAccount.tokenContract}
                                    onChange={(event) => handleInput(event, "tokenContract")}
                                    className="border border-gray-300 p-2 rounded text-black w-full"
                                    placeholder='0x0000000000000000000000000000000000000000'
                                />
                            </label>
                            <label className="flex flex-col text-white w-full">
                                NFT ID:
                                <input
                                    type="text"
                                    onChange={(event) => handleInput(event, "tokenId")}

                                    value={TBAccount.tokenId}
                                    className="border border-gray-300 p-2 rounded text-black w-full"
                                    placeholder='1'
                                />
                            </label>
                        </div>
                        <div className="flex flex-col md:flex-row md:space-x-4 w-full md:w-1/2">
                            {(TBAccount.tokenContract || TBAccount.tokenId) && <button
                                type="button"
                                className="flex-1 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                onClick={() => resetAccount()}
                            >
                                {(TBAccount.tokenContract && TBAccount.tokenId) ? "Reset" : "Fill all inputs or reset"}

                            </button>}
                            {TBAccount.tokenContract && TBAccount.tokenId && < button
                                onClick={() => handleSubmit()}
                                className="flex-1 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            >
                                {!isTbaCreate && retrievedAccount ? "Check balance TBA" : "Check deployed TBA"}
                            </button>}
                            {isTbaCreate && (
                                <>
                                    <button className="flex-1 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded banner" onClick={() => createAccount()}>
                                        Create TBA
                                    </button>
                                </>
                            )}

                        </div>
                        {isTbaCreate && (
                            <div className="text-orange-300">
                                <div  >Tba account {retrievedAccount} is not deployed yet </div>
                                <div> for token {TBAccount.tokenContract} with tokenId {TBAccount.tokenId}</div>

                            </div>
                        )}
                        {!isTbaCreate && retrievedAccount && (
                            <div className="text-orange-300">
                                <div>Tba account {retrievedAccount} is  deployed   </div>
                                <div> for contract {TBAccount.tokenContract} with tokenId {TBAccount.tokenId}</div>
                            </div>
                        )}
                    </div>
                )
                }
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
                )}

                <Tooltip id="back-tooltip" />
                {error.isError && <div data-tooltip-id='error-tooltip' data-tooltip-content={error.reason} className="text-white">{error.reason}</div>}
                <Tooltip id="error-tooltip" />
            </div >


        </div >
    )
}
export default TBA; 
