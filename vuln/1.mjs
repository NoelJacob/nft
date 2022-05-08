import TonWeb from "tonweb";

const {NftCollection} = TonWeb.token.nft;
const tonweb = new TonWeb(new TonWeb.HttpProvider('https://toncenter.com/api/v2/jsonRPC', {apiKey: '06efaf2640a6b57b4b9111a430ebbb395c2f3dae37becd5d52f5337edc385bf2'}));
const col = new NftCollection(tonweb.provider, {address: 'UQDt-JT0q3w6AIXettD_eD3OREz63rwTG5vgW8ZYmcVKNMms'});
console.log((await col.getNftItemAddressByIndex((await col.getCollectionData()).nextItemIndex)).toString(true, true, true, false));

