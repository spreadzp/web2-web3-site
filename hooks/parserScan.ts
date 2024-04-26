"use server";

import { ethers } from "ethers";
import { getProvider } from "./useEthersSigner";
import * as cheerio from "cheerio";
import type { Balance } from "./store";
import { proxyUrl } from "./proxyUrl";

export const fetchPageContent = async (
    url: string
): Promise<string[]> => {

    try {
        let addressesTokens: string[] = [];
        const html = await proxyUrl(url) as string;

        const $ = cheerio.load(html);

        const tokensLinks: string[] = [];
        // eslint-disable-next-line  
        $('a[href^="/token/"]').each((index, element) => {
            console.log("🚀 ~ $ ~ index:", index)
            const href = $(element).attr("href");
            if (href) {
                tokensLinks.push(href);
            }
        });
        addressesTokens = tokensLinks.map(
            (href) =>
                href?.substring(href.lastIndexOf("/") + 1, href.indexOf("?")) ?? ""
        );

        return addressesTokens;
    } catch (err) {
        console.log("err", err);
        return [];
    } finally {

    }
};

export const getFullBalance = async (
    address: string,
    etherscanUrl: string,
): Promise<Balance> => {
    const url = `${etherscanUrl}/address/${address}`;
    const tokenAddresses = await fetchPageContent(url);
    return await getTokensInfo(tokenAddresses, address);
};

async function getTokensInfo(
    addressesContracts: string[],
    addressOwner: string,
): Promise<Balance> {
    const balance: Balance = { erc20s: [], erc721s: [], ethBalance: "0" };
    if (!addressesContracts || addressesContracts.length === 0) {
        return balance;
    }

    const abiNft = [
        // Constructor
        "constructor(string symbol, string name)",

        // State mutating method
        "function transferFrom(address from, address to, uint amount)",

        // State mutating method, which is payable
        "function mint(uint amount) payable",

        // Constant method (i.e. "view" or "pure")
        "function balanceOf(address owner) view returns (uint)",
        "function ownerOf(uint256 tokenId) view returns (address)",
        // An Event
        "event Transfer(address indexed from, address indexed to, uint256 amount)",

        // A Custom Solidity Error
        "error AccountLocked(address owner, uint256 balance)",

        // Examples with structured types
        "function addUser(tuple(string name, address addr) user) returns (uint id)",
        "function addUsers(tuple(string name, address addr)[] user) returns (uint[] id)",
        "function getUser(uint id) view returns (tuple(string name, address addr) user)",
        "function tokenURI(uint256 tokenId) public view returns (string memory)",
        "function symbol() view returns (string memory)",
        "function name() view returns (string memory)",
    ];

    const provider = await getProvider();
    const ethBalance = await provider.getBalance(addressOwner);
    balance.ethBalance = ethers.formatUnits(ethBalance, 18);
    for (const address of addressesContracts) {
        const contractInstance = new ethers.Contract(address, abiNft, provider);


        try {
            const balanceResult = await contractInstance.balanceOf(addressOwner);
            const numberTokensOrNftId = ethers.formatUnits(balanceResult, 18);

            const [name, symbol] = await Promise.all([
                contractInstance.name(),
                contractInstance.symbol(),
            ]);
            if (Number(numberTokensOrNftId) < 100) {
                try {
                } catch (err) { }
                const uri = await contractInstance.tokenURI(0);
                const ownerAddress = await contractInstance.ownerOf(0);
                console.log("🚀 ~ ownerAddress:", ownerAddress);
                balance.erc721s.push({
                    contractAddress: address,
                    nftId: Number(numberTokensOrNftId),
                    uri,
                    name,
                    symbol,
                });
            } else {
                balance.erc20s.push({
                    contractAddress: address,
                    balance: `${numberTokensOrNftId}`,
                    name,
                    symbol,
                });
            }

        } catch (err) {
            console.log("err", err);
        }
    }
    return balance;
}

