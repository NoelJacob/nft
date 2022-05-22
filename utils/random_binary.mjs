import TonWeb from "tonweb";
import fs from "node:fs";

const tonweb = new TonWeb();

let array = [];
for (let z = 0; z < 400; ++z) {
    let bin = "";
    let wallet = tonweb.wallet.create({publicKey: TonWeb.utils.nacl.sign.keyPair().publicKey, wc: 0}); // create interface to wallet smart contract (wallet v3 by default)
    (await wallet.getAddress()).hashPart.forEach(x => bin += x.toString(2).padStart(8, "0"));
    array.push(bin)
}

fs.writeFileSync("./raw.txt", array.join(""), {encoding: "binary"})
