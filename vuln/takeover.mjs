import {Address, Cell, toNano, TonClient} from 'ton';
import {SmartContract} from 'ton-contract-executor';
import {mnemonicToWalletKey} from 'ton-crypto';

let collection_address = 'EQCJaFzm-puvZA7xY60etfjdor6gslk3ygvtPxj5m6ZhhRuQ';
let num_of_takeovers = 1;

let collection = Address.parse(collection_address);
let client = new TonClient({
  endpoint: 'https://testnet.toncenter.com/api/v2/jsonRPC',
  apiKey: process.env.API_KEY,
});

let state = await client.getContractState(collection);
let code = Cell.fromBoc(state.code)[0];
let data = Cell.fromBoc(state.data)[0];
let contract = await SmartContract.fromCell(code, data, {debug: false});
contract.setC7Config({myself: collection})
let collection_data = await contract.invokeGetMethod('get_collection_data', []);
let total = collection_data.result[0].toNumber();
let res = await contract.invokeGetMethod('get_nft_address_by_index',
  [{type: 'int', value: String(total + num_of_takeovers - 1)}]);
let newItem = res.result[0].readAddress();

let key = await mnemonicToWalletKey(process.env.SEED_PHRASE.split(" "))
let wallet = await client.findWalletFromSecretKey({secretKey: key.secretKey, workchain: 0});
let seqno = await wallet.getSeqNo();
await wallet.transfer({to: newItem, value: toNano(0.001), seqno, secretKey: key.secretKey, bounce: false});
console.log(newItem.toFriendly());
process.exit();
