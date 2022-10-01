import TonWeb from 'tonweb';
import {mnemonicToWalletKey} from 'ton-crypto';
// import dotenv from 'dotenv';
// dotenv.config();

let {NftCollection, NftItem} = TonWeb.token.nft;

let client = new TonWeb(new TonWeb.HttpProvider('https://testnet.toncenter.com/api/v2/jsonRPC',
  {apiKey: process.env.TONWEB_API}));
let key = await mnemonicToWalletKey(process.env.SEED_PHRASE.split(' '));
let wallet = new client.wallet.all.v4R2(client.provider, {publicKey: key.publicKey, wc: 0});
let walletAddress = await wallet.getAddress();
let amount = TonWeb.utils.toNano(0.001);
let seqno = (await wallet.methods.seqno().call()) || 0;
// let collection = await newCollection();
// await wallet.methods.transfer(
//   {secretKey: key.secretKey, amount, seqno, ...collection}).send();
// console.log(collection.toAddress);

let collectionAddress = "EQCJaFzm-puvZA7xY60etfjdor6gslk3ygvtPxj5m6ZhhRuQ";
let nft = await newItem(collectionAddress)
await wallet.methods.transfer({secretKey: key.secretKey, amount, seqno, ...nft}).send()

async function newCollection() {
  let nftCollection = new NftCollection(client.provider, {
    ownerAddress: walletAddress,
    royalty: 0.99,
    royaltyAddress: walletAddress,
    collectionContentUri: 'testxxxx',
    nftItemContentBaseUri: 'testxxx',
    nftItemCodeHex: NftItem.codeHex
  });
  let stateInit = (await nftCollection.createStateInit()).stateInit;
  let nftCollectionAddress = await nftCollection.getAddress();
  return {toAddress: nftCollectionAddress.toString(true, true, false), stateInit};
}

async function newItem(collectionAddress) {
  let address = new TonWeb.utils.Address(collectionAddress);
  let nftCollection = new NftCollection(client.provider, {address});
  let itemIndex = (await nftCollection.getCollectionData()).nextItemIndex;
  const payload = await nftCollection.createMintBody({
    amount, itemIndex, itemOwnerAddress: walletAddress, itemContentUri: `testxxx`,
  });
  return {toAddress: address.toString(true, true, true), payload};
}

// Make transfer for collection and item and test if takeover works on that collection
