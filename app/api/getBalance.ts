import type { NextApiRequest, NextApiResponse } from "next";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { nftContractAddress, nftId } = req.body;
        try {
            const balanceData = await getBalance(nftContractAddress, nftId);
            res.status(200).json(balanceData);
        } catch (error) {
            console.log("🚀 ~ getAccount ~ error:", error);
            res.status(500).json({ error: 'An error occurred while fetching the balance.' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed.' });
    }
}

async function getBalance(contractAddress: string, nftId: string) {
    console.log("🚀 ~ getBalance ~ nftId:", nftId)
    console.log("🚀 ~ getBalance ~ contractAddress:", contractAddress)
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