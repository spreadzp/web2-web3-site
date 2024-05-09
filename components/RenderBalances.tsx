import { useTbaSiteStore, type Balance } from "../hooks/store";
import type { TableData } from "../interfaces/components.itypes";
import { getIconByName } from "./Icons";
import Table from "./Table";

const renderLinkUri = (uri: string) => {
    return (<a href={uri} target="_blank" rel="noopener noreferrer" className='text-blue-500'>Link</a>);
}
export const RenderBalances = () => {
    const {
        tbaBalance,
        walletClient,
        TBAccount,
        retrievedAccount,
        setTbaBalance
    } = useTbaSiteStore();
    if (!tbaBalance) return null;
    const coinData: TableData[] = [{ '#': 1, symbol: walletClient?.chain?.nativeCurrency.symbol || "ETH", amount: parseFloat(tbaBalance.ethBalance) }];
    const tokenData: TableData[] = tbaBalance.erc20s.map((token, index) => ({
        '#': index + 2,
        address: token.contractAddress,
        name: token.name,
        amount: parseFloat(token.balance),
    }));
    const nftData: TableData[] = tbaBalance.erc721s.map((nft, index) => ({
        '#': index + tbaBalance.erc20s.length + 2,
        name: nft.name,
        uri: renderLinkUri(nft.uri),
        symbol: nft.symbol,
        //nftId: nft.nftId,
        nftMetadata: JSON.stringify(nft.symbol),
    }));

    return <>
        <button
            onClick={() => setTbaBalance({} as Balance)}
            data-tooltip-id="back-tooltip"
            data-tooltip-content={'Back to Inputs'}
            className="flex items-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
            {getIconByName('Back')}
        </button>
        <div>
            <div className="w-full text-center text-white font-bold mb-4">Balances for Tba account {retrievedAccount} </div>
            <div className="w-full text-center text-white font-bold mb-4"> Created from contract {TBAccount.tokenContract} with nftId {TBAccount.tokenId}</div>
            <div className="w-full text-center text-white font-bold mb-4">Balance in coins</div>
            <Table data={coinData} />
            <div className="w-full text-center text-white font-bold mb-4">Balance in tokens</div>
            <Table data={tokenData} />
            <div className="w-full text-center text-white font-bold mb-4">Balance in NFTs</div>
            <Table data={nftData} />
        </div>
    </>;
}