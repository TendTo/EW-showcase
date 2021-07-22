class ApiResult {
    readonly baseUrl = 'https://volta-explorer.energyweb.org';

    protected constructor() { }

    static shortenAddress(address: string) {
        return address ? `${address.slice(0, 8)}...${address.slice(-6)}` : "";
    }
    static convertVT(value: string) {
        if (!value || value === "0") return "0";
        const decimals = 18;
        const pointIndex = Math.max(1, (value.length) - decimals);
        const zeroesToAdd = Math.max(-1, decimals - value.length);
        let minIndex = 0;
        for (let i = value.length - 1; i >= 0; i--) {
            const element = value[i];
            if (element === "0")
                continue;
            else {
                minIndex = i;
                break;
            }
        }
        if (zeroesToAdd >= 0)
            return `0.${"0".repeat(zeroesToAdd)}${value.slice(0, minIndex + 1)}`;
        const decimalNumber = minIndex >= pointIndex ? `.${value.slice(pointIndex, minIndex + 1)}` : "";
        return `${value.slice(0, pointIndex)}${decimalNumber}`;
    }
}

export default ApiResult;
