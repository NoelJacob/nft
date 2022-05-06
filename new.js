import TonWeb from "tonweb";
import {TsarinaMarketplace} from "./helpers"

(async () => {
    const tonweb = new TonWeb(new TonWeb.HttpProvider('https://testnet.toncenter.com/api/v2/jsonRPC'));

    const seed = TonWeb.utils.base64ToBytes('vt58J2v6FaSuXFGcyGtqT5elpVxcZ+I1zgu/GUfA5uY=');
    const keyPair = TonWeb.utils.nacl.sign.keyPair.fromSeed(seed);
    const WalletClass = tonweb.wallet.all['v3R1'];
    const wallet = new WalletClass(tonweb.provider, {
        publicKey: keyPair.publicKey,
        wc: 0
    });
    const walletAddress = await wallet.getAddress();
    console.log('wallet address=', walletAddress.toString(true, true, true));

    // NFTMarketplace
    const nftMarketplace = new TsarinaMarketplace(tonweb.provider, {});
    const nftMarketplaceAddress = await nftMarketplace.getAddress();
    console.log(await wallet.methods.transfer({
        seqno: (await wallet.methods.seqno().call()) || 0,
        secretKey: keyPair.secretKey,
        toAddress: nftMarketplaceAddress.toString(true, true, false),
        amount: TonWeb.utils.toNano(0.1),
        payload: null,
        sendMode: 3,
        stateInit: (await nftMarketplace.createStateInit()).stateInit
    }).send());

    // NftCollectionItemMintSale
    const collectionAmount = TonWeb.utils.toNano(0.01);
    const nftAmounts = [TonWeb.utils.toNano(0.01)];
    const saleAmount = TonWeb.utils.toNano(0.1);
    const gasFee = TonWeb.utils.toNano(0.001);
    const marketplaceFeePercentage = TonWeb.utils.toNano(0.01);
    const fullPrices = [TonWeb.utils.toNano(0.1)];
    const mintSale = TsarinaMarketplace.mintSale({
        nftCollection: {
            ownerAddress: walletAddress,
            royalty: 0.13,
            royaltyAddress: walletAddress,
            collectionContentUri: 'http://localhost:63342/nft-marketplace/my_collection.json',
            nftItemContentBaseUri: 'http://localhost:63342/nft-marketplace/',
            nftItemCodeHex: null,
        },
        nftItems: [{
            amount: nftAmounts[0],
            itemIndex: 0,
            // itemOwnerAddress: saleAddress,
            itemContentUri: 'my_nft.json'
        }],
        marketplaceAddress: nftMarketplaceAddress.toString(true, true, true),
        collectionAmount,
        saleAmount,
        fullPrices,
        marketplaceFeePercentage,
        nftCollectionCodeHex: null,
    });
    console.log(
        await wallet.methods.transfer({
            secretKey: keyPair.secretKey,
            toAddress: nftMarketplaceAddress.toString(true, true, true),
            amount: collectionAmount + nftAmounts.reduce((x, y) => x + y, 0) + saleAmount + gasFee,
            seqno: (await wallet.methods.seqno().call()) || 0,
            sendMode: 3,
            payload: mintSale,
        }).send()
    );
})()

// await deployNftCollection();
// await getNftCollectionInfo();
// await deployNftItem();
// await getNftItemInfo();
// await deployMarketplace();
// await deploySale();
// await getSaleInfo();
// await getStaticData();
// await transferNftItem();
// await cancelSale();
// await changeCollectionOwner();
// await editCollectionContent();
// await getRoyaltyParams();
