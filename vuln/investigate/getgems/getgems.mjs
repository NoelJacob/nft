import fetch from 'node-fetch';
import fs from 'node:fs';

import TonWeb from 'tonweb';

import {Address, Cell, TonClient} from 'ton';
import {SmartContract} from 'ton-contract-executor';

let raw = JSON.stringify({
  'operationName': 'mainPageTopCollection',
  'variables': {
    'kind': 'all',
    'count': 100,
  },
  'query': 'query mainPageTopCollection($kind: MPTopKind!, $count: Int!, $cursor: String) {\n mainPageTopCollection(kind: $kind, first: $count, after: $cursor) {\n cursor\n items {\n place\n collection {\n address\n name\n isVerified\n }\n }\n }\n}',
});

let requestOptions = {
  method: 'POST',
  headers: {
    'content-type': 'application/json',
  },
  body: raw,
  redirect: 'follow',
};

let result = await fetch('https://api.getgems.io/graphql', requestOptions);
let items = (await result.json()).data.mainPageTopCollection.items;
items.splice(82, 1); // .ton dns domains special collection
items = items.map(x => [x.place + 1, x.collection.name, x.collection.address, x.collection.isVerified]);

fs.writeFileSync('./items.csv', 'Index, Name, Address, Verified, Total (w), First (w), Last (w), New 1 (w), New 2 (w), Total (e), First (e), Last (e), New 1 (e), New 2 (e)\n');
for (let item of items) {
  let w = getFromTonweb(item[2]);
  let e = getFromLocalExecutor(item[2]);
  [w, e] = await Promise.all([w, e]);

  let data = item.join(', ') + ', '  // Name, Address, Verified
    + w.slice(0, 4).join(', ') + ', '  // Total (w), First (w), Last (w), New 1 (w)
    + (w[4] !== w[3] ? w[4] : '') + ', '  // New 2 (w)
    + (w[0] !== e[0] ? e[0] : '') + ', ' // Total (e)
    + (w[1] !== e[1] ? e[1] : '') + ', '  // First (e)
    + (w[2] !== e[2] ? e[2] : '') + ', '  // Last (e)
    + (w[3] !== e[3] ? e[3] : '') + ', ' // New 1 (e)
    + (w[4] !== e[4] ? e[4] : '') + '\n' // New 2 (e)

  // let data = item.join(', ') + ', ' + w.join(', ') + ', ' + e.join(', ') + '\n';

  fs.appendFileSync('./items.csv', data);
  console.log(item[0], item[1]);
}
process.exit(); // The ton-contract-executor process keeps on running

async function getFromTonweb(address) {
  let {NftCollection} = TonWeb.token.nft;

  let client = new TonWeb(new TonWeb.HttpProvider('https://toncenter.com/api/v2/jsonRPC',
    {apiKey: process.env.TONWEB_API}));

  let collection = new NftCollection(client.provider,
    {address});

  let total = (await collection.getCollectionData()).nextItemIndex;
  let firstPromise = collection.getNftItemAddressByIndex(0);
  let lastPromise = collection.getNftItemAddressByIndex(total - 1);
  let new1Promise = collection.getNftItemAddressByIndex(total);
  let new2Promise = collection.getNftItemAddressByIndex(total + 1);

  let [first, last, new1, new2] = await Promise.all([firstPromise, lastPromise, new1Promise, new2Promise]);

  return [String(total), first.toString(true, true, true, false), last.toString(true, true, true, false), new1.toString(true, true, true, false), new2.toString(true, true, true, false)];
}

async function getFromLocalExecutor(address) {
  let collection = Address.parse(address);
  let client = new TonClient({
    endpoint: 'https://toncenter.com/api/v2/jsonRPC',
    apiKey: process.env.TONWEB_API,
  });

  let state = await client.getContractState(collection);
  let code = Cell.fromBoc(state.code)[0];
  let data = Cell.fromBoc(state.data)[0];
  let contract = await SmartContract.fromCell(code, data, {getMethodsMutate: true, debug: false});
  contract.setC7Config({myself: collection});
  let collection_data = await contract.invokeGetMethod('get_collection_data', []);
  let total = collection_data.result[0].toNumber();
  let firstPromise = contract.invokeGetMethod('get_nft_address_by_index',
    [{type: 'int', value: String(0)}]);
  let lastPromise = await contract.invokeGetMethod('get_nft_address_by_index',
    [{type: 'int', value: String(total - 1)}]);
  let new1Promise = await contract.invokeGetMethod('get_nft_address_by_index',
    [{type: 'int', value: String(total)}]);
  let new2Promise = await contract.invokeGetMethod('get_nft_address_by_index',
    [{type: 'int', value: String(total + 1)}]);

  let [first, last, new1, new2] = await Promise.all([firstPromise, lastPromise, new1Promise, new2Promise]);

  return [
    String(total),
    first.result[0].readAddress().toFriendly({urlSafe: true, bounceable: true, testOnly: false}),
    last.result[0].readAddress().toFriendly({urlSafe: true, bounceable: true, testOnly: false}),
    new1.result[0].readAddress().toFriendly({urlSafe: true, bounceable: true, testOnly: false}),
    new2.result[0].readAddress().toFriendly({urlSafe: true, bounceable: true, testOnly: false})];
}
