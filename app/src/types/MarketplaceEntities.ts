import { ethers, Signer } from "ethers";
import { abi as IdentityManagerABI } from '../asset/json/IdentityManager.abi.json';
import { abi as MarketplaceABI } from '../asset/json/Marketplace.abi.json';
import { VOLTA_IDENTITY_MANAGER_ADDRESS, VOLTA_MARKETPLACE_ADDRESS } from '../asset/json/voltaContractAddresses.json';
import { IdentityManagerAbi as IdentityManager } from './IdentityManagerAbi';
import { MarketplaceAbi as Marketplace } from './MarketplaceAbi';

const zeroAddress = '0x0000000000000000000000000000000000000000';


export class Asset {
    constructor(private _asset: string, private _owner: string = zeroAddress, private _volume: number = 0, private _price: number = 0, private _remainingVolume: number = 0, private _matches: number = 0) { }

    public static async fetchAssets(signer: Signer, owners: string[]) {
        const identityManager = new ethers.Contract(VOLTA_IDENTITY_MANAGER_ADDRESS, IdentityManagerABI, signer) as IdentityManager;
        const assets = await Promise.all(owners.map(async (owner) => {
            const assetsCreated = await identityManager.queryFilter(
                identityManager.filters.IdentityCreated(null, owner),
                'earliest',
                'latest'
            );
            const assetsTransferred = await identityManager.queryFilter(
                identityManager.filters.IdentityTransferred(null, owner),
                'earliest',
                'latest'
            );
            // Consider all assets the user may owns among the ones that he has created or those that were transferred to him
            const possibleAssets = new Set([...assetsCreated, ...assetsTransferred].map(({ args }) => args.identity));
            // Filter out assets that are not currently owned by the user
            return Promise.all(Array.from(possibleAssets)
                .filter(async (identity) => owner === await identityManager.identityOwner(identity))
                .map(async (identity) => new Asset(identity, owner).fetchMarketplaceOffer(signer)));
        }));
        return assets.flat();
    }

    public async fetchOwner(signer: Signer) {
        const identityManager = new ethers.Contract(VOLTA_IDENTITY_MANAGER_ADDRESS, IdentityManagerABI, signer) as IdentityManager;
        this._owner = await identityManager.identityOwner(this.asset);
        return this._owner;
    }

    public async fetchMarketplaceOffer(signer: Signer) {
        const marketplace = new ethers.Contract(VOLTA_MARKETPLACE_ADDRESS, MarketplaceABI, signer) as Marketplace;
        const offer = await marketplace.offers(this.asset);

        this._matches = offer.matches.toNumber();
        this._volume = offer.volume.toNumber();
        this._remainingVolume = offer.remainingVolume.toNumber();
        this._price = offer.price.toNumber();
        return this;
    }

    public async createOffer(signer: Signer, volume: number, price: number) {
        const marketplace = new ethers.Contract(VOLTA_MARKETPLACE_ADDRESS, MarketplaceABI, signer) as Marketplace;
        await marketplace.createOffer(this.asset, volume, price);

        this._volume = volume;
        this._remainingVolume = volume;
        this._price = price;
        return this;
    }

    public async cancelOffer(signer: Signer) {
        const marketplace = new ethers.Contract(VOLTA_MARKETPLACE_ADDRESS, MarketplaceABI, signer) as Marketplace;
        await marketplace.cancelOffer(this.asset);

        this._volume = 0;
        this._remainingVolume = 0;
        this._price = 0;
        return this;
    }

    public clone() {
        return new Asset(this._asset, this._owner, this._volume, this._price, this._remainingVolume, this._matches);
    }

    public update(matches: number, remainingVolume: number) {
        this._matches = matches;
        this._remainingVolume = remainingVolume;
        return this;
    }

    get doesOfferExists(): boolean { return this._volume > 0 && this._price > 0; }

    get asset(): string { return this._asset; }

    get owner(): string { return this._owner; }

    get volume(): number { return this._volume; }

    get price(): number { return this._price; }

    get remainingVolume(): number { return this._remainingVolume; }

    get matches(): number { return this._matches; }

    get isMatched(): boolean { return this.matches > 0; }
}

export class Demand {
    constructor(private _buyer: string, private _volume: number = 0, private _price: number = 0, private _isMatched: boolean = false) { }

    public static async fetchDemands(signer: Signer, buyers: string[]) {
        const marketplace = new ethers.Contract(VOLTA_MARKETPLACE_ADDRESS, MarketplaceABI, signer) as Marketplace;
        let demands = [];
        for (const buyer of buyers) {
            const demandData = await marketplace.demands(buyer);
            const newDemand = new Demand(buyer, demandData.volume.toNumber(), demandData.price.toNumber(), demandData.isMatched)
            demands.push(newDemand);
        }
        return demands;
    }

    public async fetchDemand(signer: Signer) {
        const marketplace = new ethers.Contract(VOLTA_MARKETPLACE_ADDRESS, MarketplaceABI, signer) as Marketplace;
        const demand = await marketplace.demands(this._buyer);

        this._isMatched = demand.isMatched;
        this._volume = demand.volume.toNumber();
        this._price = demand.price.toNumber();
        return this;
    }

    public async createDemand(signer: Signer, volume: number, price: number) {
        const marketplace = new ethers.Contract(VOLTA_MARKETPLACE_ADDRESS, MarketplaceABI, signer) as Marketplace;
        await marketplace.createDemand(volume, price);

        this._isMatched = false;
        this._volume = volume;
        this._price = price;
        return this;
    }

    public async cancelDemand(signer: Signer) {
        const marketplace = new ethers.Contract(VOLTA_MARKETPLACE_ADDRESS, MarketplaceABI, signer) as Marketplace;
        await marketplace.cancelDemand();

        this._isMatched = false;
        this._volume = 0;
        this._price = 0;
        return this;
    }

    public clone() {
        return new Demand(this._buyer, this._volume, this._price, this._isMatched);
    }

    public update(isMatched: boolean) {
        this._isMatched = isMatched;
        return this;
    }

    get doesDemandExists(): boolean { return this._volume > 0 && this._price > 0; }

    get buyer(): string { return this._buyer; }

    get volume(): number { return this._volume; }

    get price(): number { return this._price; }

    get isMatched(): boolean { return this._isMatched; }
}

export class Match {
    constructor(private _matchId: number = 0, private _asset?: Asset, private _demand?: Demand, private _volume: number = 0, private _price: number = 0, private _isAccepted: boolean = false) { }

    public static async fetchMatches(signer: Signer, asset: Asset | Demand) {
        const marketplace = new ethers.Contract(VOLTA_MARKETPLACE_ADDRESS, MarketplaceABI, signer) as Marketplace;
        const filter = asset instanceof Asset ? [asset.asset, null] : [null, asset.buyer];
        const matches = await marketplace.queryFilter(
            marketplace.filters.MatchProposed(null, ...filter),
            'earliest',
            'latest'
        );
        return (await Promise.all(
            matches
                .map(async (match) => {
                    const matchData = await marketplace.matches(match.args.matchId);
                    if (matchData.price.toString() !== "0")
                        return new Match(match.args.matchId.toNumber(),
                            new Asset(matchData.asset),
                            new Demand(matchData.buyer),
                            matchData.volume.toNumber(),
                            matchData.price.toNumber(),
                            matchData.isAccepted)
                })
        )).filter(match => match !== undefined) as Match[];
    }

    public async fetchMatch(signer: Signer, autoFetch: boolean = true) {
        const marketplace = new ethers.Contract(VOLTA_MARKETPLACE_ADDRESS, MarketplaceABI, signer) as Marketplace;
        const matches = await marketplace.matches(this._matchId);

        this._isAccepted = matches.isAccepted;
        this._volume = matches.volume.toNumber();
        this._price = matches.price.toNumber();

        this._asset = new Asset(matches.asset);
        this._demand = new Demand(matches.buyer);
        if (autoFetch) {
            await this._asset.fetchMarketplaceOffer(signer);
            await this._demand.fetchDemand(signer);
        }

        return this;
    }

    private resetMatch() {
        this._isAccepted = false;
        this._volume = 0;
        this._price = 0;
        this._asset = undefined;
        this._demand = undefined;
    }

    private async recursiveFetch(signer: Signer) {
        if (this._asset)
            await this._asset.fetchMarketplaceOffer(signer);
        if (this._demand)
            await this._demand.fetchDemand(signer);
    }

    public async proposeMatch(signer: Signer, asset: Asset, demand: Demand, volume: number, price: number) {
        const marketplace = new ethers.Contract(VOLTA_MARKETPLACE_ADDRESS, MarketplaceABI, signer) as Marketplace;
        await marketplace.proposeMatch(asset.asset, demand.buyer, volume, price);

        this._isAccepted = false;
        this._volume = volume;
        this._price = price;
        this._asset = asset;
        this._demand = demand;
        return this;
    }

    public async cancelProposedMatch(signer: Signer, aggregator: string) {
        const marketplace = new ethers.Contract(VOLTA_MARKETPLACE_ADDRESS, MarketplaceABI, signer) as Marketplace;
        await marketplace.cancelProposedMatch(this._matchId);

        this.resetMatch();
        return this;
    }

    public async acceptMatch(signer: Signer, buyer: string, autoFetch: boolean = true) {
        const marketplace = new ethers.Contract(VOLTA_MARKETPLACE_ADDRESS, MarketplaceABI, signer) as Marketplace;
        await marketplace.acceptMatch(this._matchId);

        this._isAccepted = true;
        if (autoFetch)
            await this.fetchMatch(signer, true);
        return this;
    }

    public async rejectMatch(signer: Signer, buyer: string, autoFetch: boolean = true) {
        const marketplace = new ethers.Contract(VOLTA_MARKETPLACE_ADDRESS, MarketplaceABI, signer) as Marketplace;
        await marketplace.rejectMatch(this._matchId);

        if (autoFetch)
            await this.recursiveFetch(signer);
        this.resetMatch();
        return this;
    }

    public async deleteMatch(signer: Signer, buyerOrOwner: string, autoFetch: boolean = true) {
        const marketplace = new ethers.Contract(VOLTA_MARKETPLACE_ADDRESS, MarketplaceABI, signer) as Marketplace;
        await marketplace.deleteMatch(this._matchId);

        if (autoFetch)
            await this.recursiveFetch(signer);
        this.resetMatch();
        return this;
    }

    public clone() {
        return new Match(this._matchId, this._asset, this._demand, this._volume, this._price, this._isAccepted);
    }

    get doesMatchExists(): boolean { return this._volume > 0 && this._price > 0 && this._matchId > 0; }

    get matchId(): number { return this._matchId; }

    get asset(): Asset | undefined { return this._asset; }

    get demand(): Demand | undefined { return this._demand; }

    get volume(): number { return this._volume; }

    get price(): number { return this._price; }

    get isAccepted(): boolean { return this._isAccepted; }
}