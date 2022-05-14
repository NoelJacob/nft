import TonWeb from "tonweb";
import arg from "arg";

const args = arg({
    "-a": Boolean,
    "--add": "-a",
    "-n": Number,
    "--number": "-n",
    "-d": Boolean,
    "--dry": "-d",
});
console.log(args)
const {NftCollection} = TonWeb.token.nft;
const tonweb = new TonWeb(new TonWeb.HttpProvider('https://toncenter.com/api/v2/jsonRPC', {apiKey: '06efaf2640a6b57b4b9111a430ebbb395c2f3dae37becd5d52f5337edc385bf2'}));
const col = new NftCollection(tonweb.provider, {address: 'UQDt-JT0q3w6AIXettD_eD3OREz63rwTG5vgW8ZYmcVKNMms'});
const lastItem = (await col.getCollectionData()).nextItemIndex;
for (let i = lastItem; i < lastItem + args["-n"]; ++i) {
    console.log((await col.getNftItemAddressByIndex(i)).toString(true, true, true, false));
}
