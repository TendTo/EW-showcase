import { MarketplaceAbi } from './Marketplace.abi';
import { PastEventOptions } from 'web3-eth-contract';
import { ContractEventData } from './typeExt';

type DemandCancelled = ContractEventData<{
  buyer: string;
  0: string;
}>;
type DemandCreated = ContractEventData<{
  buyer: string;
  volume: string;
  price: string;
  0: string;
  1: string;
  2: string;
}>;
type MatchAccepted = ContractEventData<{
  matchId: string;
  0: string;
}>;
type MatchCancelled = ContractEventData<{
  matchId: string;
  0: string;
}>;
type MatchDeleted = ContractEventData<{
  matchId: string;
  0: string;
}>;
type MatchProposed = ContractEventData<{
  matchId: string;
  asset: string;
  buyer: string;
  0: string;
  1: string;
  2: string;
}>;
type MatchRejected = ContractEventData<{
  matchId: string;
  0: string;
}>;
type OfferCancelled = ContractEventData<{
  asset: string;
  0: string;
}>;
type OfferCreated = ContractEventData<{
  asset: string;
  volume: string;
  price: string;
  0: string;
  1: string;
  2: string;
}>;

type MarketplaceEventString = "DemandCancelled" |
  "DemandCreated" |
  "MatchAccepted" |
  "MatchCancelled" |
  "MatchDeleted" |
  "MatchProposed" |
  "MatchRejected" |
  "OfferCancelled";

type MarketplaceEventType<T extends MarketplaceEventString> =
  T extends "DemandCancelled" ? DemandCancelled :
  T extends "DemandCreated" ? DemandCreated :
  T extends "MatchAccepted" ? MatchAccepted :
  T extends "MatchCancelled" ? MatchCancelled :
  T extends "MatchDeleted" ? MatchDeleted :
  T extends "MatchProposed" ? MatchProposed :
  T extends "MatchRejected" ? MatchRejected :
  T extends "OfferCancelled" ? OfferCancelled :
  never;

type MarketplaceEventOptions<T extends MarketplaceEventString> =
  T extends "DemandCancelled" ? Partial<{ buyer: string; }> :
  T extends "DemandCreated" ? Partial<{ buyer: string; volume: string; price: string; }> :
  T extends "MatchAccepted" ? Partial<{ matchId: string; }> :
  T extends "MatchCancelled" ? Partial<{ matchId: string; }> :
  T extends "MatchDeleted" ? Partial<{ matchId: string; }> :
  T extends "MatchProposed" ? Partial<{ matchId: string; asset: string; buyer: string; }> :
  T extends "MatchRejected" ? Partial<{ matchId: string; }> :
  T extends "OfferCancelled" ? Partial<{ asset: string; }> :
  never;

interface MarketplacePastEventOptions<T extends MarketplaceEventString> extends PastEventOptions {
  filter?: MarketplaceEventOptions<T>;
}

export default interface Marketplace extends MarketplaceAbi {
  getPastEvents<T extends MarketplaceEventString>(event: T): Promise<MarketplaceEventType<T>[]>;
  getPastEvents<T extends MarketplaceEventString>(
    event: T,
    options: MarketplacePastEventOptions<T>,
    callback: (error: Error, event: MarketplaceEventType<T>) => void
  ): Promise<MarketplaceEventType<T>[]>;
  getPastEvents<T extends MarketplaceEventString>(event: T, options: MarketplacePastEventOptions<T>): Promise<MarketplaceEventType<T>[]>;
  getPastEvents<T extends MarketplaceEventString>(
    event: T,
    callback: (error: Error, event: MarketplaceEventType<T>) => void
  ): Promise<MarketplaceEventType<T>[]>;
}
