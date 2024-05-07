"use server";

import { ethers } from "ethers";
import { getProvider } from "./useEthersSigner";
import * as cheerio from "cheerio";
import type { Balance, ERC20Param, ERC721Param } from "./store";
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

    const abiToken = [
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

    const balancePromises = addressesContracts.map(async (address) => {
        const contractInstance = new ethers.Contract(address, abiToken, provider);

        try {
            const [balanceResult, name, symbol] = await Promise.all([
                contractInstance.balanceOf(addressOwner),
                contractInstance.name(),
                contractInstance.symbol()
            ]);
            const numberTokensOrNftId = ethers.formatUnits(balanceResult, 18);
            const numberedToken = Number(numberTokensOrNftId);

            if (numberedToken > 1) { // TODO check for erc721
                return {
                    contractAddress: address,
                    balance: `${numberTokensOrNftId}`,
                    name,
                    symbol,
                    type: 'erc20'
                };
            } else {
                const nfts = []
                const countOfNfts = numberedToken * 1e18
                const urlTokens = `https://testnet.bscscan.com/token/${address}?a=${addressOwner}`;
                for (let index = 0; index < countOfNfts; index++) {
                    const nftData = {
                        contractAddress: address,
                        //         nftId: numberNft,
                        uri: urlTokens,
                        ownerAddress: addressOwner,
                        name,
                        symbol,
                        type: 'erc721'
                    }
                    nfts.push(nftData)
                }
                //console.log("🚀 ~ balancePromises ~ urlTokens:", urlTokens)
                //const urlTokens = 'https://testnet.bscscan.com/token/0xddbabeaef71416c4273928aa88b661dddcce33f5'
                // const tokenIds = await fetchTokensContent(urlTokens);


                // const nftPromises = tokenIds.map(async (numberNft) => {
                //     console.log("🚀 ~ nftPromises ~ numberNft:", numberNft)
                //     const [uri, ownerAddress] = await Promise.all([
                //         contractInstance.tokenURI(numberNft),
                //         contractInstance.ownerOf(numberNft)
                //     ]);

                //     return {
                //         contractAddress: address,
                //         nftId: numberNft,
                //         uri,
                //         ownerAddress,
                //         name,
                //         symbol,
                //         type: 'erc721'
                //     };
                // });

                // return Promise.all(nftPromises);
                return nfts
            }
        } catch (err) {
            console.error("Error fetching tokens content:", err);
            return [];
        }
    });

    // Wait for all promises to resolve and update the balance object
    try {
        const results = await Promise.all(balancePromises);
        // Flatten the results and separate ERC20s and ERC721s
        const erc20s: ERC20Param[] = [];
        const erc721s: ERC721Param[] = [];

        results.forEach(result => {
            if (Array.isArray(result)) {
                erc721s.push(...result);
            } else {
                erc20s.push(result);
            }
        });

        // Update the balance object with the results
        balance.erc20s = erc20s;
        balance.erc721s = erc721s;
    } catch (err) {
        console.error("Error processing balances:", err);
    }

    return balance;
}



export const fetchTokensContent = async (url: string): Promise<number[]> => {
    try {
        const html = await proxyUrl(url);
        debugger
        const $ = cheerio.load(html);
        console.log("🚀 ~ fetchTokensContent ~ $:", $)

        // Find all the <td> elements that contain the token ID information
        const tokenIdTds = $('td').filter((index, element) => {
            console.log("🚀 ~ tokenIdTds ~ element:", element)
            debugger
            const href = $(element).find('a').attr('href');
            return href && href.startsWith('/nft/');
        });
        debugger
        // Extract the token IDs from the href attribute of the <a> tags
        const tokenIds = tokenIdTds.map((index, element) => {
            const href = $(element).find('a').attr('href') || '';
            const tokenId = href.split('/').pop() || ''; // Get the last part after the last '/'
            return parseInt(tokenId, 10); // Convert the token ID to a number
        }).get(); // Convert the Cheerio object to a plain array

        console.log(tokenIds); // 

        return tokenIds;
    } catch (err) {
        console.error("Error fetching tokens content:", err);
        return [];
    }
};