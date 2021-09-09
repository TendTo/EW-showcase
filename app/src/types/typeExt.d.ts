import { EventData } from "web3-eth-contract";

export interface ContractEventData<T> extends EventData {
  returnValues: T;
}