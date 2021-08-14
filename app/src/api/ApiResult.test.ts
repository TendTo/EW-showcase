import ApiResult from "./ApiResult";

describe("ApiResult", () => {

    test("shortenAddress", () => {
        expect(ApiResult.shortenAddress("123456789123456789")).toBe("12345678...456789");
    });

    test("convertVT", () => {
        expect(ApiResult.convertVT("00001", 5)).toBe("0.00001");
        expect(ApiResult.convertVT("0001", 5)).toBe("0.00001");
        expect(ApiResult.convertVT("1", 5)).toBe("0.00001");
        expect(ApiResult.convertVT("10", 5)).toBe("0.0001");
        expect(ApiResult.convertVT("10000", 5)).toBe("0.1");
        expect(ApiResult.convertVT("100000", 5)).toBe("1");
        expect(ApiResult.convertVT("1000000", 5)).toBe("10");
        expect(ApiResult.convertVT("10000000", 5)).toBe("100");
        expect(ApiResult.convertVT("1000001", 5)).toBe("10.00001");
        expect(ApiResult.convertVT("1001001", 5)).toBe("10.01001");
        expect(ApiResult.convertVT("1111100", 5)).toBe("11.111");
    });

    test("convertToNumber", () => {
        expect(ApiResult.convertToNumber("1")).toBe(1);
        expect(ApiResult.convertToNumber("10.1")).toBe(101);
    });
});