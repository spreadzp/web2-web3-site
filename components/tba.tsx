'use client';
import React, { useCallback, useEffect, useState } from 'react';
import { Tooltip } from 'react-tooltip';
import type { TBAccountParams } from '@tokenbound/sdk';
import { useTbaSiteStore } from '../hooks/store';
import { useAccount } from 'wagmi';
import { createPublicClient, createWalletClient, custom } from 'viem';
import { bscTestnet } from 'viem/chains';
import { getFullBalance } from '../hooks/parserScan';
import ACCOUNT_REGISTRY_CONTRACT from "../app/ABIs/artifacts/AccountRegistry.json";
import { RenderBalances } from './RenderBalances';
import { TbaInfo } from './TbaInfo';


const TBA: React.FC = () => {
    const {
        tbaBalance,
        setTbaBalance,
        publicClient,
        setPublicClient,
        walletClient,
        tokenBoundClient,
        TBAccount, setTBAccount,
        setWalletClient,
        retrievedAccount, setRetrievedAccount
    } = useTbaSiteStore();
    const { address } = useAccount();
    const browserWeb3Provider =
        typeof window !== "undefined" ? window.ethereum : null;

    const [isCheckingBalance, setIsCheckingBalance] = useState(false)
    // eslint-disable-next-line
    //const [menu] = useState(initMenu);
    // eslint-disable-next-line
    const [tokenContract] = useState(
        process.env.NEXT_PUBLIC_NFT_CONTRACT as `0x${string}`
    );
    const DEFAULT_ACCOUNT: TBAccountParams = {
        tokenContract: tokenContract,
        tokenId: '2',
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

    const initPublicClient = useCallback(() => {
        const client = createPublicClient({
            chain: bscTestnet,
            transport: custom(browserWeb3Provider!),
        });
        setPublicClient(client);

    }, [browserWeb3Provider, setPublicClient])


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
        if (TBAccount.tokenContract as `0x${string}` && tokenBoundClient) {
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
    }, [TBAccount.tokenContract, TBAccount.tokenId, tokenBoundClient, publicClient, initPublicClient, setRetrievedAccount, setIsTbaDeployed, setIsTbaCreate]);


    const handleSubmit = useCallback(async () => {
        try {
            await checkDeployTBAccount()
            if (isTbaDeployed) {
                setIsCheckingBalance(true)
                const balanceTba = await getFullBalance(
                    retrievedAccount as string,
                    walletClient?.chain?.blockExplorers?.etherscan.url as string,

                ); //'https://testnet.bscscan.com/address/0xe3821b4Ab191d0E776b108Ea3bFb395286CB7010') 
                console.log("🚀 ~ handleSubmit ~ balanceTba:", balanceTba)
                setTimeout(async () => {
                    console.log('balanceTba')
                    if (balanceTba) {
                        setTbaBalance(balanceTba);
                    }
                }, 1000)

            }
        } catch (error) {
            setError({ isError: true, reason: JSON.stringify(error) });
            console.log("🚀 ~ getAccount ~ error:", error);
        } finally {
            setIsCheckingBalance(false)
        }
    }, [checkDeployTBAccount, isTbaDeployed, retrievedAccount, walletClient.chain, setTbaBalance]);

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

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#76004f] to-[#4b4fa6]">
            <div className="container mx-auto p-4">
                {!tbaBalance.ethBalance && (
                    <div className="flex flex-col space-y-4 items-center">
                        <div className="flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0 w-full md:w-1/2">
                            <label className="flex flex-col text-white w-full">
                                NFT Contract Address:
                                <input
                                    type="text"
                                    value={TBAccount.tokenContract || ''}
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

                                    value={TBAccount.tokenId || ''}
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
                            {TBAccount.tokenContract && TBAccount.tokenId && isCheckingBalance ?
                                <button className=" banner flex-1 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded banner" >Checking balance...</button> : < button
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
                            <TbaInfo isDeployed={false} />
                        )}
                        {!isTbaCreate && retrievedAccount && (
                            <TbaInfo isDeployed={true} />
                        )}
                    </div>
                )
                }
                {tbaBalance.ethBalance && (
                    <RenderBalances />
                )}

                <Tooltip id="back-tooltip" />
                {error.isError && <div data-tooltip-id='error-tooltip' data-tooltip-content={error.reason} className="text-white">{error.reason}</div>}
                <Tooltip id="error-tooltip" />
            </div >


        </div >
    )
}
export default TBA; 
