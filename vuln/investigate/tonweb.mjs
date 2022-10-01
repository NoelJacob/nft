import TonWeb from 'tonweb';

let {NftCollection} = TonWeb.token.nft;

let client = new TonWeb(new TonWeb.HttpProvider('https://toncenter.com/api/v2/jsonRPC',
    {apiKey: process.env.TONWEB_API}));

let collection = new NftCollection(client.provider,
    {address: 'EQAo92DYMokxghKcq-CkCGSk_MgXY5Fo1SPW20gkvZl75iCN'});

let total = (await collection.getCollectionData()).nextItemIndex;

let addr = await collection.getNftItemAddressByIndex(total);
console.log(total, addr.toString(true, true, true, false));
process.exit();
