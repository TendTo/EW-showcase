const IdentityManager = artifacts.require('./Identity/IdentityManager.sol');
const Identity = artifacts.require('./Identity/OfferableIdentity.sol');

contract('IdentityManager', async accounts => {
    let identityAddress;
    let manager;
    const account = accounts[0];

    before(async () => {
        identityAddress = (await Identity.new()).address;
    });

    beforeEach(async () => {
        manager = await IdentityManager.new(identityAddress);
    });

    it('Create new assets', async () => {
        const tx = await manager.createIdentity(account);
        const identity = tx.receipt.logs[0].args.identity;
        assert.equal(await manager.identityOwner.call(identity), account);
    });
});