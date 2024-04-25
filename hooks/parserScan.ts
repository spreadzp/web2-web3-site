"use server";

import { ethers } from "ethers";
import { getProvider } from "./useEthersSigner";
import { PuppeteerCrawler } from "crawlee";
import type { Balance } from "./store";

export const fetchPageContent = async (
  url: string
  //actor: Actor
): Promise<[string[]]> => {
  //const actor = new Actor();
  let crawler: PuppeteerCrawler | null = null;
  try {
    let addressesTokens: string[] = [];
    crawler = new PuppeteerCrawler({
      async requestHandler({ page }) {
        //await page.goto(url)
        const hrefs = await page.evaluate(() => {
          const links = Array.from(
            document.querySelectorAll('a[href^="/token/"]')
          );
          return links.map((link) => link.getAttribute("href"));
        });
        addressesTokens = hrefs.map(
          (href: any) =>
            href?.substring(href.lastIndexOf("/") + 1, href.indexOf("?")) ?? ""
        );
        // await Dataset.pushData({
        //   title: await page.title(),
        //   url: request.url,
        //   succeeded: true,
        // });
      },
      //   preNavigationHooks: [
      //     async (crawlingContext, gotoOptions) => {
      //        // const { page } = crawlingContext;
      //         //await page.evaluate((attr) => { window.foo = attr; }, 'bar');
      //         gotoOptions.timeout = 60_000;
      //         gotoOptions.waitUntil = 'domcontentloaded';
      //     },
      // ],
      // async failedRequestHandler({ request }) {
      //   // This function is called when the crawling of a request failed too many times
      //   await Dataset.pushData({
      //     url: request.url,
      //     succeeded: false,
      //     errors: request.errorMessages,
      //   });
      // },
    });

    await crawler.run([url]);
    return [addressesTokens];
  } catch (err) {
    console.log("err", err);
    return [[]];
  } finally {
    crawler = null
    // await actor.exit(); // Call the exit function from the actor instance
  }
};

export const getFullBalance = async (
  address: string,
  etherscanUrl: string,
  rpcUrl: string
): Promise<Balance> => {
  //const address = "0xe3821b4Ab191d0E776b108Ea3bFb395286CB7010";
  let tokenBalance = {} as Balance;
  console.log("🚀 ~ wallet:", etherscanUrl);
  const url = `${etherscanUrl}/address/${address}`;

  console.log("🚀 ~ getFullBalance ~ url:", url);
  //const actor = new Actor();
  const [tokenAddresses] = await fetchPageContent(url);
  //await actor.exit();

  //if (tokenAddresses.length > 0) {
  console.log("🚀 ~ tokenAddresses:", tokenAddresses);
  // tokenBalance = await getReceipts(tokenAddresses, address, rpcUrl);
  return await getTokensInfo(tokenAddresses, address, rpcUrl);
  //}
};

async function getTokensInfo(
  addressesContracts: string[],
  addressOwner: string,
  rpcUrl: string
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

  const abiErc20 = [
    // Constructor
    "constructor(string symbol, string name)",

    // State mutating method
    "function transferFrom(address from, address to, uint amount)",

    // State mutating method, which is payable
    "function mint(uint amount) payable",

    // Constant method (i.e. "view" or "pure")
    "function balanceOf(address owner) view returns (uint)",
    // An Event
    "event Transfer(address indexed from, address indexed to, uint256 amount)",

    // A Custom Solidity Error

    // Examples with structured types
    "function symbol() view returns (string memory)",
    "function name() view returns (string memory)",
  ];
  // const iface = new ethers.Interface(abiNft);
  // const ifaceErc20 = new ethers.Interface(abiErc20);

  // const coder = ethers.AbiCoder.defaultAbiCoder();
  const provider = await getProvider();
  const ethBalance = await provider.getBalance(addressOwner);
  balance.ethBalance = ethers.formatUnits(ethBalance, 18);
  //balance.ethBalance = Number(ethBalance);
  for (const address of addressesContracts) {
    const contractInstance = new ethers.Contract(address, abiNft, provider);

    let tokenOwner = "";
    try {
      const balanceResult = await contractInstance.balanceOf(addressOwner);
      console.log("🚀 ~ getTokensInfo ~ balanceResult:", balanceResult);
      const numberTokensOrNftId = ethers.formatUnits(balanceResult, 18);

      const [name, symbol] = await Promise.all([
        contractInstance.name(),
        contractInstance.symbol(),
      ]);
      if (Number(numberTokensOrNftId) < 100) {
        const nftIds = [];
        try {
          //
          //while (false) {}
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

      //tokenOwner = await contractInstance.ownerOf(addressOwner);
    } catch (err) {
      console.log("err", err);
    }
  }
  return balance;
}

// async function getReceipts(
//   txs: string[],
//   addressOwner: string,
//   rpcUrl: string
// ): Promise<Balance> {
//   let tokenBalance = {} as Balance;
//   const provider = await getProvider();
//   //new ethers.JsonRpcProvider(rpcUrl);

//   // Retrieve transaction receipts for each transaction hash
//   const transactionReceipts: ethers.TransactionReceipt[] = [];
//   for (const txHash of txs) {
//     console.log("🚀 ~ txHash:", txHash);
//     const receipt = await provider.getTransactionReceipt(txHash);
//     if (receipt) {
//       tokenBalance = await parseEventsFromReceipt(
//         receipt,
//         addressOwner,
//         provider
//       );
//       transactionReceipts.push(receipt);
//     }
//     //console.log("transactionReceipts", transactionReceipts);
//   }
//   return tokenBalance;
// }

// export const parseEventsFromReceipt = async (
//   receipt: ethers.TransactionReceipt,
//   addressOwner: string,
//   provider: ethers.AbstractProvider
// ): Promise<Balance> => {
//   const abiNft = [
//     // Constructor
//     "constructor(string symbol, string name)",

//     // State mutating method
//     "function transferFrom(address from, address to, uint amount)",

//     // State mutating method, which is payable
//     "function mint(uint amount) payable",

//     // Constant method (i.e. "view" or "pure")
//     "function balanceOf(address owner) view returns (uint)",
//     "function ownerOf(uint256 tokenId) view returns (address)",
//     // An Event
//     "event Transfer(address indexed from, address indexed to, uint256 amount)",

//     // A Custom Solidity Error
//     "error AccountLocked(address owner, uint256 balance)",

//     // Examples with structured types
//     "function addUser(tuple(string name, address addr) user) returns (uint id)",
//     "function addUsers(tuple(string name, address addr)[] user) returns (uint[] id)",
//     "function getUser(uint id) view returns (tuple(string name, address addr) user)",
//     "function tokenURI(uint256 tokenId) public view returns (string memory)",
//     "function symbol() view returns (string memory)",
//     "function name() view returns (string memory)",
//   ];

//   const abiErc20 = [
//     // Constructor
//     "constructor(string symbol, string name)",

//     // State mutating method
//     "function transferFrom(address from, address to, uint amount)",

//     // State mutating method, which is payable
//     "function mint(uint amount) payable",

//     // Constant method (i.e. "view" or "pure")
//     "function balanceOf(address owner) view returns (uint)",
//     // An Event
//     "event Transfer(address indexed from, address indexed to, uint256 amount)",

//     // A Custom Solidity Error

//     // Examples with structured types
//     "function symbol() view returns (string memory)",
//     "function name() view returns (string memory)",
//   ];
//   const iface = new ethers.Interface(abiNft);
//   const ifaceErc20 = new ethers.Interface(abiErc20);
//   const balance: Balance = { erc20s: [], erc721s: [], ethBalance: "0" };

//   // const coder = ethers.AbiCoder.defaultAbiCoder();
//   const ethBalance = await provider.getBalance(addressOwner);
//   balance.ethBalance = ethers.formatUnits(ethBalance);
//   //balance.ethBalance = Number(ethBalance);
//   for (const log of receipt.logs) {
//     console.log("log.topics[0]", log.topics[0]);
//     //console.log("🚀 ~ log:", log);
//     //coder.encode(["address", "address", "uint256"], log.topics);
//     const topicHashNft =
//       "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"; //iface.encodeFilterTopics("Transfer", [])[0];
//     const topicHashErc20 =
//       "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef";
//     if (topicHashNft === log.topics[0]) {
//       // console.log("🚀 ~ log:", log.data);

//       const parsedData = iface.decodeEventLog(
//         "Transfer",
//         log.topics[3],
//         log.topics
//       ); // log.iface.parseLog({ topics: log.topics, data: log.data });
//       if (parsedData.some((item) => item === addressOwner)) {
//         //console.log("log.address", log.address);
//         const contractInstance = new ethers.Contract(
//           log.address, // "0xDDBABEAef71416c4273928Aa88b661DddCce33f5",
//           abiNft,
//           provider
//         );
//         // console.log("🚀 ~ parseData:", parsedData);
//         // console.log("Number(log.data)", Number(log.topics[3]));
//         let tokenOwner = "";
//         try {
//           tokenOwner = await contractInstance.ownerOf(Number(log.topics[3]));
//         } catch (err) {
//           console.log("err", err);
//         }
//         if (tokenOwner !== "" && tokenOwner === addressOwner) {
//           const [name, symbol, uri] = await Promise.all([
//             contractInstance.name(),
//             contractInstance.symbol(),
//             contractInstance.tokenURI(Number(log.topics[3])),
//           ]);
//           // const name = await contractInstance.name();
//           // const symbol = await contractInstance.symbol();
//           // const uri = await contractInstance.tokenURI(Number(log.topics[3]));
//           if (name && symbol && uri) {
//             balance.erc721s.push({
//               contractAddress: log.address,
//               nftId: Number(log.topics[3]),
//               uri,
//               name,
//               symbol,
//             });
//           }
//         }
//       }
//     }
//     if (topicHashErc20 === log.topics[0] && Number(log.data) > 0) {
//       console.log("🚀 ~ log.topics:", log);
//       const parsedData = ifaceErc20.decodeEventLog(
//         "Transfer",
//         log.data,
//         log.topics
//       ); // log.iface.parseLog({ topics: log.topics, data: log.data });
//       console.log("🚀 ~ parsedData:", parsedData);
//       if (parsedData.some((item) => item === addressOwner)) {
//         //console.log("log.address", log.address);
//         const contractInstance = new ethers.Contract(
//           log.address, // "0xDDBABEAef71416c4273928Aa88b661DddCce33f5",
//           abiErc20,
//           provider
//         );
//         // console.log("🚀 ~ parseData:", parsedData);
//         // console.log("Number(log.data)", Number(log.topics[3]));
//         let erc20Balance = "";
//         try {
//           const erc20BalanceBN = await contractInstance.balanceOf(addressOwner);
//           erc20Balance = ethers.formatUnits(erc20BalanceBN);
//         } catch (err) {
//           console.log("err", err);
//         }
//         if (erc20Balance !== "") {
//           const [name, symbol] = await Promise.all([
//             contractInstance.name(),
//             contractInstance.symbol(),
//           ]);
//           // const name = await contractInstance.name();
//           // const symbol = await contractInstance.symbol();
//           // const uri = await contractInstance.tokenURI(Number(log.topics[3]));
//           if (name && symbol) {
//             balance.erc20s.push({
//               contractAddress: log.address,
//               balance: erc20Balance,
//               name,
//               symbol,
//             });
//           }
//         }
//       }
//     }
//     // Decode log data using the contract interface
//     // const parsedLog = contractInterface.parseLog(log);
//     // events.push(parsedLog);
//   }
//   return balance;
// };
