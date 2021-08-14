import VoltaApi from './VoltaApi';

describe('VoltaApi', () => {

    test('VoltaApi exists', () => {
        expect(VoltaApi).toBeTruthy();
    });

    test('VoltaApi instantiates', () => {
        expect(new VoltaApi()).toBeTruthy();
    });

    test('VoltaApi getEthBalance', async () => {
        const address = "0x1f603e0000000000000000000000000000000000";
        const { id, jsonrpc, result } = await new VoltaApi().getEthBalance(address);
        expect(id).toBe(0);
        expect(jsonrpc).toBe("2.0");
        expect(result).toBe("0xd3c21bcecceda1000000");
    });

    test('VoltaApi getBalance', async () => {
        const address = "0x1f603e0000000000000000000000000000000000";
        const { message, status, result } = await new VoltaApi().getBalance(address);
        expect(message).toBe("OK");
        expect(status).toBe("1");
        expect(result).toBe("1000000000000000000000000");
    });

    test('VoltaApi getBalanceMulti', async () => {
        const address1 = "0x1f603e0000000000000000000000000000000000";
        const address2 = "0x5D5dA31000000000000000000000000000000000";
        const { message, status, result } = await new VoltaApi().getBalanceMulti(address1, address2);
        expect(message).toBe("OK");
        expect(status).toBe("1");
        for (const singleResult of result) {
            if (singleResult.account.toLowerCase() === address1.toLowerCase()) {
                expect(singleResult.balance).toBe("1000000000000000000000000");
                expect(singleResult.stale).toBe(false);
            }
            else if (singleResult.account.toLowerCase() === address2.toLowerCase()) {
                expect(singleResult.balance).toBe("1750000000000000000000000");
                expect(singleResult.stale).toBeDefined();
            }
            else {
                console.error(singleResult);
                throw Error("Unexpected account received");
            }
        }
    });

    test('VoltaApi getTransactionsList empy', async () => {
        const address = "0x1f603e0000000000000000000000000000000000";
        const { message, status, result } = await new VoltaApi().getTransactionsList(address);
        expect(message).toBe("No transactions found");
        expect(status).toBe("0");
        expect(result.length).toBe(0);
    });

    test('VoltaApi getTransactionsList results', async () => {
        const address = "0x120470000000000000000000000000000000000a";
        const { message, status, result } = await new VoltaApi().getTransactionsList(address);
        expect(message).toBe("OK");
        expect(status).toBe("1");
        expect(result.length).toBeGreaterThan(0);
    });
});