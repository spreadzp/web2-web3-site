"use server";
// import { launch } from "chrome-launcher";
// import { proxyUrl } from "./proxyUrl";

// export const fetchPageContent = async (url: string): Promise<string> => {
//   const chrome = await launch({
//     startingUrl: url,
//     chromeFlags: ["--headless", "--disable-gpu"],
//   });
//   const response = await proxyUrl(url, {
//     headers: {
//       "User-Agent":
//         "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36",
//     },
//   });
//   const chr = await chrome;
//   console.log("🚀 ~ fetchPageContent ~ chr:", chr);
//   await chrome.kill();
//   return response as string;
// };
// import puppeteer from "puppeteer";

// export const fetchPageContent = async (url: string): Promise<string> => {
//   const browser = await puppeteer.launch();
//   const page = await browser.newPage();
//   await page.goto(url, {
//     timeout: 30000,
//     waitUntil: "load",
//     referrerPolicy: "*",
//   }); //
//   const htmlContent = await page.content();
//   //console.log("🚀 ~ fetchPageContent ~ htmlContent:", htmlContent);
//   await browser.close();
//   return htmlContent;
// };

// import { JSDOM } from "jsdom";
// export const extractLinks = async (htmlContent: string): Promise<string[]> => {
//   const hrefs: string[] = [];
//   //if (typeof window !== "undefined") {
//   const dom = new JSDOM(htmlContent);
//   const links = dom.window.document.querySelectorAll("a");

//   links.forEach((link: any) => {
//     const href = link.getAttribute("href");
//     if (href && href.startsWith("/nft/")) {
//       hrefs.push(href);
//     }
//   });
//   //   } else {
//   //     // Code that runs in a Node.js environment
//   //   }
//   return hrefs;
// };
