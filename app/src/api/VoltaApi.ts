import BaseApi from "./BaseApi";

type sort = 'asc' | 'desc';
type status = '0' | '1';

type baseVoltaResponse = {
    message: string
    status: status
}

/**
 * Api query parameters
 **/
type queryParams = {
    module: string
    action: string
    [key: string]: any
}

type getAccountQueryParams = {
    sort?: sort
    startblock?: number
    endblock?: number
    page?: number
    offset?: number
    filterby?: string
    starttimestamp?: number
    endtimestamp?: number
}

/**
 * Api responses result fields
 **/
export type getBalanceMultiSingleResponse = {
    account: string
    balance: string
    stale: boolean
}

export interface getTransactionListSingleResponse {
    blockHash: string
    blockNumber: string
    confirmations: string
    contractAddress: string
    cumulativeGasUsed: string
    from: string
    gas: string
    gasPrice: string
    gasUsed: string
    hash: string
    input: string
    isError: status
    nonce: string
    timeStamp: string
    to: string
    transactionIndex: string
    txreceipt_status: string
    value: string
}

export type getTokenListSingleResponse = {
    balance: string
    contractAddress: string
    decimals: string
    name: string
    symbol: string
    type: string
}

/**
 * Api responses
 **/
export type getEthBalanceResponse = {
    id: number
    result: string
    jsonrpc: string
}

export type getBalanceResponse = baseVoltaResponse & {
    result: string
}

export type getBalanceMultiResponse = baseVoltaResponse & {
    result: getBalanceMultiSingleResponse[]
}

export type getTransactionsListResponse = baseVoltaResponse & {
    result: getTransactionListSingleResponse[]
}

export type getTokenListResponse = baseVoltaResponse & {
    result: getTokenListSingleResponse[]
}

export type getAccountInfoResponse = {
    tx: getTransactionsListResponse
    balance: getBalanceResponse
    token: getTokenListResponse
}


class VoltaApi extends BaseApi {
    override readonly baseUrl: string = "https://volta-explorer.energyweb.org/api";
    override readonly apiVersion: string = "v1";

    constructor(public setLoading?: (loading: boolean) => void) {
        super();
    }

    private async apiRequestWrapper(queryParams?: queryParams, method: string = "GET", body?: queryParams) {
        if (this.setLoading) this.setLoading(true);
        const res = await this.apiRequest("", method, queryParams, body);
        if (!res.ok) this.handleError(res);
        if (this.setLoading) this.setLoading(false);
        return res;
    }

    async getEthBalance(address: string, block?: string): Promise<getEthBalanceResponse> {
        const queryParams: queryParams = {
            module: "account",
            action: "eth_get_balance",
            address: address,
            block: block,
        }
        const res = await this.apiRequestWrapper(queryParams);
        return await res.json();
    }

    async getBalance(address: string): Promise<getBalanceResponse> {
        const queryParams: queryParams = {
            module: "account",
            action: "balance",
            address: address,
        }
        const res = await this.apiRequestWrapper(queryParams);
        return await res.json();
    }

    async getBalanceMulti(...addresses: string[]): Promise<getBalanceMultiResponse> {
        const queryParams: queryParams = {
            module: "account",
            action: "balancemulti",
            address: addresses.join(","),
        }
        const res = await this.apiRequestWrapper(queryParams);
        return await res.json();
    }

    async getTransactionsList(address: string, queryParams?: getAccountQueryParams): Promise<getTransactionsListResponse> {
        const apiQueryParams: queryParams = {
            module: "account",
            action: "txlist",
            address: address,
            ...queryParams,
        }
        const res = await this.apiRequestWrapper(apiQueryParams);
        return await res.json();
    }

    async getTokenList(address: string): Promise<getTokenListResponse> {
        const queryParams: queryParams = {
            module: "account",
            action: "tokenlist",
            address: address,
        }
        const res = await this.apiRequestWrapper(queryParams);
        return await res.json();
    }

    async getAccountInfo(address: string): Promise<getAccountInfoResponse> {
        return {
            tx: await this.getTransactionsList(address),
            balance: await this.getBalance(address),
            token: await this.getTokenList(address),
        }
    }

}

export default VoltaApi;