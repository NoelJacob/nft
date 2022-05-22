import TonWeb from "tonweb";
// const tonweb = new TonWeb(new TonWeb.HttpProvider('https://toncenter.com/api/v2/jsonRPC', {apiKey: '06efaf2640a6b57b4b9111a430ebbb395c2f3dae37becd5d52f5337edc385bf2'}));
// let info = await tonweb.provider.getAddressInfo("EQCD39VS5jcptHL8vMjEXrzGaRcCVYto7HUn4bpAOg8xqB2N");
let info = new TonWeb.Address("EQCD39VS5jcptHL8vMjEXrzGaRcCVYto7HUn4bpAOg8xqB2N")
let bin = [];
let arr = info.hashPart;
arr.forEach(x => bin.push(x.toString(2).padStart(8, "0")));
console.log(bin.join(""));