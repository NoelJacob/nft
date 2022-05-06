import TonWeb from 'tonweb';

const {Contract, boc: {Cell}, token: {nft: {NftCollection}}} = TonWeb;

class SplNftCollection extends NftCollection {
    /**
     * @param provider
     * @param options   {{ownerAddress: Address, collectionContentUri: string, nftItemContentBaseUri: string, nftItemCodeHex: string, royalty: number, royaltyAddress: Address, address?: Address | string, code?: Cell, totalItems?: number}}
     */
    constructor(provider, options) {
        options.code = options.code || Cell.oneFromBoc(""); // TODO: compile nft-collection-editable.fc
        super(provider, options);
        this.totalItems = options.totalItems || 0;
    }

    /**
     * @override
     * @private
     * @return {Cell} cell contains nft collection data
     */
    createDataCell() {
        const cell = new Cell();
        cell.bits.writeAddress(this.options.ownerAddress);
        cell.bits.writeUint(this.totalItems, 64); // next_item_index
        cell.refs[0] = this.createContentCell(this.options);
        cell.refs[1] = Cell.oneFromBoc(this.options.nftItemCodeHex);
        cell.refs[2] = this.createRoyaltyCell(this.options);
        return cell;
    }
}

export class TsarinaMarketplace extends Contract {
    /**
     * @param provider
     * @param options   {any}
     */
    constructor(provider, options) {
        options.wc = 0;
        options.code = Cell.oneFromBoc(""); // TODO: compile marketplace.fc
        super(provider, options);
    }

    /**
     * @return {Cell} cell contains message body to nft marketplace
     * @param options   {nftItems:Array<{itemIndex: number, amount: BN, itemOwnerAddress: Address, itemContentUri: string, queryId?: number}>,nftCollection:{ownerAddress: Address, collectionContentUri: string, nftItemContentBaseUri: string, nftItemCodeHex: string, royalty: number, royaltyAddress: Address, address?: Address | string, code?: Cell}}
     */
    async mintSale({nftCollection, nftItems}) {
        nftCollection.totalItems = nftItems.length;
        const collection = new SplNftCollection(super.provider, nftCollection);
        const itemsPromise = nftItems.map(x => collection.createMintBody(x));
        const items = await Promise.all(itemsPromise); // TODO: use Promise.allSettled
        const collectionStateInit = collection.createStateInit();
        // return options; TODO
    }

    /**
     * @override
     * @private
     * @return {Cell} cell contains nft marketplace data
     */
    createDataCell() {
        return new Cell(); // TODO
    }
}