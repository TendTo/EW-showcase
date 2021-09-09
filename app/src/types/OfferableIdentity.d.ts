import { OfferableIdentityAbi } from './OfferableIdentity.abi';
import { PastEventOptions } from 'web3-eth-contract';
import { ContractEventData } from './typeExt';

type TransactionSent = ContractEventData<{
  data: string;
  value: number;
  0: string;
  1: number;
}>;

type OfferableIdentityEventString = "TransactionSent";

type OfferableIdentityEventType<T extends OfferableIdentityEventString> =
  T extends "TransactionSent" ? TransactionSent :
  never;

type OfferableIdentityEventOptions<T extends OfferableIdentityEventString> =
  T extends "TransactionSent" ? Partial<{ data: string; value: number; }> :
  never;

interface OfferableIdentityPastEventOptions<T extends OfferableIdentityEventString> extends PastEventOptions {
  filter?: OfferableIdentityEventOptions<T>;
}

export default interface OfferableIdentity extends OfferableIdentityAbi {
  getPastEvents<T extends OfferableIdentityEventString>(event: T): Promise<OfferableIdentityEventType<T>[]>;
  getPastEvents<T extends OfferableIdentityEventString>(
    event: T,
    options: OfferableIdentityPastEventOptions<T>,
    callback: (error: Error, event: OfferableIdentityEventType<T>) => void
  ): Promise<OfferableIdentityEventType<T>[]>;
  getPastEvents<T extends OfferableIdentityEventString>(event: T, options: OfferableIdentityPastEventOptions<T>): Promise<OfferableIdentityEventType<T>[]>;
  getPastEvents<T extends OfferableIdentityEventString>(
    event: T,
    callback: (error: Error, event: OfferableIdentityEventType<T>) => void
  ): Promise<OfferableIdentityEventType<T>[]>;
}
