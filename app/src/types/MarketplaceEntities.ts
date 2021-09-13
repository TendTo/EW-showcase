import Web3 from "web3";
import { AbiItem } from 'web3-utils';
import { abi as IdentityManagerABI } from '../asset/json/IdentityManager.abi.json';
import { abi as MarketplaceABI } from '../asset/json/Marketplace.abi.json';
import { VOLTA_IDENTITY_MANAGER_ADDRESS, VOLTA_MARKETPLACE_ADDRESS } from '../asset/json/voltaContractAddresses.json';
import IdentityManager from './IdentityManager';
import Marketplace from './Marketplace';

const zeroAddress = '0x0000000000000000000000000000000000000000';


export class Asset {
    constructor(private _asset: string, private _owner: string = zeroAddress, private _volume: number = 0, private _price: number = 0, private _remainingVolume: number = 0, private _matches: number = 0) { }

    public static async fetchAssets(web3: Web3, owners: string[]) {
        const identityManager = new web3.eth.Contract(IdentityManagerABI as AbiItem[], VOLTA_IDENTITY_MANAGER_ADDRESS) as unknown as IdentityManager;
        const assets = await Promise.all(owners.map(async (owner) => {
            const assetsCreated = await identityManager.getPastEvents('IdentityCreated', {
                filter: { owner },
                fromBlock: 'earliest',
                toBlock: 'latest'
            });
            const assetsTransferred = await identityManager.getPastEvents('IdentityTransferred', {
                filter: { owner },
                fromBlock: 'earliest',
                toBlock: 'latest'
            });
            // Consider all assets the user may owns among the ones that he has created or those that were transferred to him
            const possibleAssets = Array.from(new Set([...assetsCreated, ...assetsTransferred])).map(({ returnValues }) => returnValues.identity);
            // Filter out assets that are not currently owned by the user
            return Promise.all(possibleAssets
                .filter(async (identity) => owner === await identityManager.methods.identityOwner(identity).call())
                .map(async (identity) => new Asset(identity, owner).fetchMarketplaceOffer(web3)));
        }));
        return assets.flat();
    }

    public async fetchOwner(web3: Web3) {
        const identityManager = new web3.eth.Contract(IdentityManagerABI as AbiItem[], VOLTA_IDENTITY_MANAGER_ADDRESS) as unknown as IdentityManager;
        this._owner = await identityManager.methods.identityOwner(this.asset).call();
        return this._owner;
    }

    public async fetchMarketplaceOffer(web3: Web3) {
        const marketplace = new web3.eth.Contract(MarketplaceABI as AbiItem[], VOLTA_MARKETPLACE_ADDRESS) as unknown as Marketplace;
        const offer = await marketplace.methods.offers(this.asset).call();

        this._matches = Number.parseInt(offer.matches);
        this._volume = Number.parseInt(offer.volume);
        this._remainingVolume = Number.parseInt(offer.remainingVolume);
        this._price = Number.parseInt(offer.price);
        return this;
    }

    public async createOffer(web3: Web3, owner: string, volume: number, price: number) {
        const marketplace = new web3.eth.Contract(MarketplaceABI as AbiItem[], VOLTA_MARKETPLACE_ADDRESS) as unknown as Marketplace;
        await marketplace.methods.createOffer(this.asset, volume, price).send({ from: owner });

        this._volume = volume;
        this._remainingVolume = volume;
        this._price = price;
        return this;
    }

    public async cancelOffer(web3: Web3, owner: string) {
        const marketplace = new web3.eth.Contract(MarketplaceABI as AbiItem[], VOLTA_MARKETPLACE_ADDRESS) as unknown as Marketplace;
        await marketplace.methods.cancelOffer(this.asset).send({ from: owner });

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

    public static async fetchDemands(web3: Web3, buyers: string[]) {
        const marketplace = new web3.eth.Contract(MarketplaceABI as AbiItem[], VOLTA_MARKETPLACE_ADDRESS) as unknown as Marketplace;
        let demands = [];
        for (const buyer of buyers) {
            const demandData = await marketplace.methods.demands(buyer).call();
            const newDemand = new Demand(buyer, Number.parseInt(demandData.volume), Number.parseInt(demandData.price), demandData.isMatched)
            demands.push(newDemand);
        }
        return demands;
    }

    public async fetchDemand(web3: Web3) {
        const marketplace = new web3.eth.Contract(MarketplaceABI as AbiItem[], VOLTA_MARKETPLACE_ADDRESS) as unknown as Marketplace;
        const demand = await marketplace.methods.demands(this._buyer).call();

        this._isMatched = demand.isMatched;
        this._volume = Number.parseInt(demand.volume);
        this._price = Number.parseInt(demand.price);
        return this;
    }

    public async createDemand(web3: Web3, volume: number, price: number) {
        const marketplace = new web3.eth.Contract(MarketplaceABI as AbiItem[], VOLTA_MARKETPLACE_ADDRESS) as unknown as Marketplace;
        await marketplace.methods.createDemand(volume, price).send({ from: this._buyer });

        this._isMatched = false;
        this._volume = volume;
        this._price = price;
        return this;
    }

    public async cancelDemand(web3: Web3) {
        const marketplace = new web3.eth.Contract(MarketplaceABI as AbiItem[], VOLTA_MARKETPLACE_ADDRESS) as unknown as Marketplace;
        await marketplace.methods.cancelDemand().send({ from: this._buyer });

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

    public static async fetchMatches(web3: Web3, asset: Asset | Demand) {
        const marketplace = new web3.eth.Contract(MarketplaceABI as AbiItem[], VOLTA_MARKETPLACE_ADDRESS) as unknown as Marketplace;
        const filter = asset instanceof Asset ? { asset: asset.asset } : { demand: asset.buyer };
        const matches = await marketplace.getPastEvents('MatchProposed', { filter, fromBlock: 'earliest', toBlock: 'latest' });
        return (await Promise.all(
            matches
                .map(async (match) => {
                    const matchData = await marketplace.methods.matches(match.returnValues.matchId).call();
                    if (matchData.price !== "0")
                        return new Match(Number.parseInt(match.returnValues.matchId),
                            new Asset(matchData.asset),
                            new Demand(matchData.buyer),
                            Number.parseInt(matchData.volume),
                            Number.parseInt(matchData.price),
                            matchData.isAccepted)
                })
        )).filter(match => match !== undefined) as Match[];
    }

    public async fetchMatch(web3: Web3, autoFetch: boolean = true) {
        const marketplace = new web3.eth.Contract(MarketplaceABI as AbiItem[], VOLTA_MARKETPLACE_ADDRESS) as unknown as Marketplace;
        const matches = await marketplace.methods.matches(this._matchId).call();

        this._isAccepted = matches.isAccepted;
        this._volume = Number.parseInt(matches.volume);
        this._price = Number.parseInt(matches.price);

        this._asset = new Asset(matches.asset);
        this._demand = new Demand(matches.buyer);
        if (autoFetch) {
            await this._asset.fetchMarketplaceOffer(web3);
            await this._demand.fetchDemand(web3);
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

    private async recursiveFetch(web3: Web3) {
        if (this._asset)
            await this._asset.fetchMarketplaceOffer(web3);
        if (this._demand)
            await this._demand.fetchDemand(web3);
    }

    public async proposeMatch(web3: Web3, aggregator: string, asset: Asset, demand: Demand, volume: number, price: number) {
        const marketplace = new web3.eth.Contract(MarketplaceABI as AbiItem[], VOLTA_MARKETPLACE_ADDRESS) as unknown as Marketplace;
        await marketplace.methods.proposeMatch(asset.asset, demand.buyer, volume, price).send({ from: aggregator });

        this._isAccepted = false;
        this._volume = volume;
        this._price = price;
        this._asset = asset;
        this._demand = demand;
        return this;
    }

    public async cancelProposedMatch(web3: Web3, aggregator: string) {
        const marketplace = new web3.eth.Contract(MarketplaceABI as AbiItem[], VOLTA_MARKETPLACE_ADDRESS) as unknown as Marketplace;
        await marketplace.methods.cancelProposedMatch(this._matchId).send({ from: aggregator });

        this.resetMatch();
        return this;
    }

    public async acceptMatch(web3: Web3, buyer: string, autoFetch: boolean = true) {
        const marketplace = new web3.eth.Contract(MarketplaceABI as AbiItem[], VOLTA_MARKETPLACE_ADDRESS) as unknown as Marketplace;
        await marketplace.methods.acceptMatch(this._matchId).send({ from: buyer });

        this._isAccepted = true;
        if (autoFetch)
            await this.fetchMatch(web3, true);
        return this;
    }

    public async rejectMatch(web3: Web3, buyer: string, autoFetch: boolean = true) {
        const marketplace = new web3.eth.Contract(MarketplaceABI as AbiItem[], VOLTA_MARKETPLACE_ADDRESS) as unknown as Marketplace;
        await marketplace.methods.rejectMatch(this._matchId).send({ from: buyer });

        if (autoFetch)
            await this.recursiveFetch(web3);
        this.resetMatch();
        return this;
    }

    public async deleteMatch(web3: Web3, buyerOrOwner: string, autoFetch: boolean = true) {
        const marketplace = new web3.eth.Contract(MarketplaceABI as AbiItem[], VOLTA_MARKETPLACE_ADDRESS) as unknown as Marketplace;
        await marketplace.methods.deleteMatch(this._matchId).send({ from: buyerOrOwner });

        if (autoFetch)
            await this.recursiveFetch(web3);
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