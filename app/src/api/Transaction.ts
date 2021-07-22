import ApiResult from './ApiResult';
import { getTransactionListSingleResponse } from './VoltaApi'

class Transaction extends ApiResult implements getTransactionListSingleResponse {
    blockHash: string;
    blockNumber: string;
    confirmations: string;
    contractAddress: string;
    cumulativeGasUsed: string;
    from: string;
    gas: string;
    gasPrice: string;
    gasUsed: string;
    hash: string;
    input: string;
    isError: '0' | '1';
    nonce: string;
    timeStamp: string;
    to: string;
    transactionIndex: string;
    txreceipt_status: string;
    value: string;

    constructor(transaction: getTransactionListSingleResponse) {
        super();
        this.blockHash = transaction.blockHash;
        this.blockNumber = transaction.blockNumber;
        this.confirmations = transaction.confirmations;
        this.contractAddress = transaction.contractAddress;
        this.cumulativeGasUsed = transaction.cumulativeGasUsed;
        this.from = transaction.from;
        this.gas = transaction.gas;
        this.gasPrice = transaction.gasPrice;
        this.gasUsed = transaction.gasUsed;
        this.hash = transaction.hash;
        this.input = transaction.input;
        this.isError = transaction.isError;
        this.nonce = transaction.nonce;
        this.timeStamp = transaction.timeStamp;
        this.to = transaction.to;
        this.transactionIndex = transaction.transactionIndex;
        this.txreceipt_status = transaction.txreceipt_status;
        this.value = transaction.value;
    }

    get method() {
        switch (this.input) {
            case '0x':
                return "Transfer";
            // TODO: add more cases for other transaction methods (e.g. Store, SetAttribute, etc.)
            default:
                return this.input.slice(0, 10);
        }
    }
    get UTCTimestamp() {
        const d = new Date(Number(this.timeStamp) * 1000);
        return d.toUTCString().slice(0, -4);
    }
    get transactionUrl() {
        return `${this.baseUrl}/tx/${this.hash}/internal-transactions`;
    }
    get blockNumberUrl() {
        return `${this.baseUrl}/blocks/${this.blockNumber}/transactions`;
    }
    get fromAddressUrl() {
        return `${this.baseUrl}/address/${this.from}/transactions`;
    }
    get toAddressUrl() {
        return `${this.baseUrl}/address/${this.to}/transactions`;
    }
    get valueVt() {
        return Transaction.convertVT(this.value);
    }
    get gasVt() {
        return Transaction.convertVT(this.gas);
    }
    get shortTo() {
        return Transaction.shortenAddress(this.to);
    }
    get shortFrom() {
        return Transaction.shortenAddress(this.from);
    }

    isInTransaction(address: string) {
        return this.to.toLowerCase() === address.toLowerCase();
    }
}

export default Transaction;
