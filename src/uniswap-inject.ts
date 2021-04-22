// @ts-ignore
global.Buffer = global.Buffer || require('buffer').Buffer;
// @ts-ignore
global.process = {
  env: {}
}
// @ts-ignore
window.createKeccakHash = require('keccak')
// @ts-ignore
// window.Buffer = window.Buffer || require('buffer').Buffer;
import { Indexer, Server } from '@airswap/protocols'
import { chainIds } from '@airswap/constants'
import { getDefaultProvider, utils } from 'ethers';
import tokensAddresses from './tokenAddresses';


const network = "homestead";
const provider = getDefaultProvider(network);

console.log("hello uniswap!");

const indexer = new Indexer(chainIds.MAINNET, provider);

const getQuote = async (token1Symbol: string, token2Symbol: string, token1Amount: string)=> {
  console.log('getQuote');
  if (tokensAddresses.hasOwnProperty(token1Symbol) && tokensAddresses.hasOwnProperty(token2Symbol)) {
    const { locators } = await indexer.getLocators(tokensAddresses[token1Symbol], tokensAddresses[token2Symbol])
    const servers = locators.map((locatorAddress)=> new Server(locatorAddress));
    const quotePromises = servers.map(async (server)=> {
      const quote = await server.getSenderSideQuote(
        token1Amount, // signerAmount
        tokensAddresses[token1Symbol], // signerToken
        tokensAddresses[token2Symbol], // senderToken
      )
      return quote;
    })
    const quotes = await Promise.all(quotePromises);
    quotes.forEach((quote)=> {
      console.log(utils.formatUnits(quote.sender.amount || "", 18))
    })
  }
}

getQuote('WETH', 'DAI', utils.parseEther("1").toString());

// setInterval(() => {
//   const pair = Array.from(
//     document.querySelectorAll(".token-symbol-container")
//   ).map((el) => el.textContent);
//   console.log(pair);
//   const amounts = Array.from(
//     document.querySelectorAll<HTMLInputElement>("input.token-amount-input")
//   ).map((el) => el.value);
//   console.log(amounts);
// }, 2500);
//
