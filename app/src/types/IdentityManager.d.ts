import { IdentityManagerAbi } from './IdentityManager.abi';
import { PastEventOptions } from 'web3-eth-contract';
import { ContractEventData } from './typeExt';

type IdentityCreated = ContractEventData<{
    identity: string;
    owner: string;
    at: string;
    0: string;
    1: string;
    2: string;
}>;
type IdentityOfferCanceled = ContractEventData<{
    identity: string;
    owner: string;
    oferedto: string;
    at: string;
    0: string;
    1: string;
    2: string;
    3: string;
}>;
type IdentityOfferRejected = ContractEventData<{
    identity: string;
    owner: string;
    offeredTo: string;
    at: string;
    0: string;
    1: string;
    2: string;
    3: string;
}>;
type IdentityOffered = ContractEventData<{
    identity: string;
    owner: string;
    offeredTo: string;
    at: string;
    0: string;
    1: string;
    2: string;
    3: string;
}>;
type IdentityTransferred = ContractEventData<{
    identity: string;
    owner: string;
    at: string;
    0: string;
    1: string;
    2: string;
}>;

type IdentityManagerEventString = "IdentityCreated" |
    "IdentityCreated" |
    "IdentityOfferCanceled" |
    "IdentityOfferRejected" |
    "IdentityOffered" |
    "IdentityTransferred";

type IdentityManagerEventType<T extends IdentityManagerEventString> =
    T extends "IdentityCreated" ? IdentityCreated :
    T extends "IdentityOfferCanceled" ? IdentityOfferCanceled :
    T extends "IdentityOfferRejected" ? IdentityOfferRejected :
    T extends "IdentityOffered" ? IdentityOffered :
    T extends "IdentityTransferred" ? IdentityTransferred :
    never;

type IdentityManagerEventOptions<T extends IdentityManagerEventString> =
    T extends "IdentityCreated" ? Partial<{ identity: string; owner: string; at: string; }> :
    T extends "IdentityOfferCanceled" ? Partial<{ identity: string; owner: string; oferedto: string; at: string; }> :
    T extends "IdentityOfferRejected" ? Partial<{ identity: string; owner: string; offeredTo: string; at: string; }> :
    T extends "IdentityOffered" ? Partial<{ identity: string; owner: string; offeredTo: string; at: string; }> :
    T extends "IdentityTransferred" ? Partial<{ identity: string; owner: string; at: string; }> :
    never;

interface IdentityManagerPastEventOptions<T extends IdentityManagerEventString> extends PastEventOptions {
    filter?: IdentityManagerEventOptions<T>;
}

export default interface IdentityManager extends IdentityManagerAbi {
    getPastEvents<T extends IdentityManagerEventString>(event: T): Promise<IdentityManagerEventType<T>[]>;
    getPastEvents<T extends IdentityManagerEventString>(
        event: T,
        options: IdentityManagerPastEventOptions<T>,
        callback: (error: Error, event: IdentityManagerEventType<T>) => void
    ): Promise<IdentityManagerEventType<T>[]>;
    getPastEvents<T extends IdentityManagerEventString>(event: T, options: IdentityManagerPastEventOptions<T>): Promise<IdentityManagerEventType<T>[]>;
    getPastEvents<T extends IdentityManagerEventString>(
        event: T,
        callback: (error: Error, event: IdentityManagerEventType<T>) => void
    ): Promise<IdentityManagerEventType<T>[]>;
}
