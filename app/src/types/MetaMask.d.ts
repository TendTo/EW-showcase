export interface JsonRpcPayload {
    jsonrpc: string;
    method: string;
    params: any[];
    id?: string | number;
}

export interface JsonRpcResponse {
    jsonrpc: string;
    id: number;
    result?: any;
    error?: string;
}

export interface RequestArguments {
    method: string;
    params?: any;
    [key: string]: any;
}

export interface WindowProvider {
    chainId: string
    enable: () => void
    isMetaMask: boolean
    networkVersion: string
    selectedAddress: string
    on: ((event: string, callback: (...args: any[]) => void) => void)
    off: ((event: string, callback?: (...args: any[]) => void) => void)
    removeListener: ((event: string, callback: (...args: any[]) => void) => void)
    sendAsync(payload: JsonRpcPayload, callback: (error: Error | null, result?: JsonRpcResponse) => void): void;
    send: (payload: JsonRpcPayload | string, callback?: (error: Error | null, result?: JsonRpcResponse) => void) => Promise<void>;
    request: (args: RequestArguments) => Promise<any>;
    connected?: boolean;
}