class ApiResult {
    readonly baseUrl = 'https://volta-explorer.energyweb.org';

    protected constructor() { }

    static shortenAddress(address: string) {
        return address ? `${address.slice(0, 8)}...${address.slice(-6)}` : "";
    }
    static convertVT(value: string, decimals: number = 9) {
        if (!value || /^0+$/g.test(value)) return "0";
        decimals = Math.min(9, decimals);
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
    static convertToNumber(value: string) {
        if (!value) return 0;
        return parseInt(value.replace(/[^0-9]/g, ''));
    }
}

export default ApiResult;
