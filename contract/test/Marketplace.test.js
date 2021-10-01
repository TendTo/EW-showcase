const IdentityManager = artifacts.require('./Identity/IdentityManager.sol');
const Identity = artifacts.require('./Identity/OfferableIdentity.sol');
const Marketplace = artifacts.require('./Marketplace/Marketplace.sol');
const { catchRevert } = require('./exception');

contract('Marketplace', async accounts => {
    let managerAddress; // identity manager contract address
    let asset; // asset address
    let marketplace; // marketplace contract
    const owner = accounts[0]; // owner of the asset
    const buyer = accounts[1]; // energy buyer 
    const aggregator = accounts[1]; // in this test we use the buyer is his own aggregator
    const externalUser = accounts[2]; // external user
    const offerVolume = 300;
    const offerPrice = 23;
    const demandVolume = 50;
    const demandPrice = 23;

    before(async () => {
        const identityAddress = (await Identity.new()).address;
        const manager = await IdentityManager.new(identityAddress);
        const tx = await manager.createIdentity(owner);

        asset = tx.receipt.logs[0].args.identity;
        managerAddress = manager.address;
    });

    beforeEach(async () => {
        marketplace = await Marketplace.new(managerAddress);
    });

    /*******************************************************************************************
     * Offer
     *******************************************************************************************/
    it('Submit an offer', async () => {
        const tx = await marketplace.createOffer(asset, offerVolume, offerPrice, { from: owner });
        const event = tx.logs[0].args;
        const offer = await marketplace.offers(asset);

        assert.equal(event.__length__, 3);
        assert.equal(event.asset, asset);
        assert.equal(event.volume.toNumber(), offerVolume);
        assert.equal(event.price.toNumber(), offerPrice);

        assert.equal(offer.matches.toNumber(), 0);
        assert.equal(offer.volume.toNumber(), offerVolume);
        assert.equal(offer.price.toNumber(), offerPrice);
    });

    it('Fail to submit an offer not being the asset owner', async () => {
        await catchRevert(marketplace.createOffer(asset, offerVolume, offerPrice, { from: externalUser }));
    });

    it('Fail to submit an offer with invalid data', async () => {
        await catchRevert(marketplace.createOffer(externalUser, offerVolume, offerPrice, { from: owner }));
        await catchRevert(marketplace.createOffer(asset, 0, offerPrice, { from: owner }));
        await catchRevert(marketplace.createOffer(asset, offerVolume, 0, { from: owner }));
    });

    it('Cancel an offer', async () => {
        // Offer is made
        await submitOffer(owner, marketplace, asset, offerVolume, offerPrice);

        const tx = await marketplace.cancelOffer(asset);
        const event = tx.logs[0].args;
        const offer = await marketplace.offers(asset);

        assert.equal(event.__length__, 1);
        assert.equal(event.asset, asset);

        assert.equal(offer.matches.toNumber(), 0);
        assert.equal(offer.volume.toNumber(), 0);
        assert.equal(offer.price.toNumber(), 0);
    });

    it('Fail to cancel an offer that does not exists', async () => {
        await catchRevert(marketplace.cancelOffer(asset, { from: owner }));
    });

    it('Fail to cancel an offer not being the asset owner', async () => {
        await submitOffer(owner, marketplace, asset, offerVolume, offerPrice);

        await catchRevert(marketplace.cancelOffer(asset, { from: externalUser }));
    });

    /*******************************************************************************************
     * Demand
     *******************************************************************************************/
    it('Submit a demand', async () => {
        const tx = await marketplace.createDemand(demandVolume, demandPrice, { from: buyer });
        const event = tx.logs[0].args;
        const demand = await marketplace.demands(buyer);

        assert.equal(event.__length__, 3);
        assert.equal(event.buyer, buyer);
        assert.equal(event.volume.toNumber(), demandVolume);
        assert.equal(event.price.toNumber(), demandPrice);

        assert.equal(demand.isMatched, false);
        assert.equal(demand.volume.toNumber(), demandVolume);
        assert.equal(demand.price.toNumber(), demandPrice);
    });

    it('Fail to submit an demand with invalid data', async () => {
        await catchRevert(marketplace.createDemand(0, demandPrice, { from: buyer }));
        await catchRevert(marketplace.createDemand(demandVolume, 0, { from: buyer }));
    });

    it('Cancel a demand', async () => {
        // Demand is made
        await submitDemand(buyer, marketplace, demandVolume, demandPrice);

        const tx = await marketplace.cancelDemand({ from: buyer });
        const event = tx.logs[0].args;
        const demand = await marketplace.demands(buyer);

        assert.equal(event.__length__, 1);
        assert.equal(event.buyer, buyer);

        assert.equal(demand.isMatched, false);
        assert.equal(demand.volume.toNumber(), 0);
        assert.equal(demand.price.toNumber(), 0);
    });

    it('Fail to cancel a demand that does not exists', async () => {
        await catchRevert(marketplace.cancelDemand({ from: buyer }));
    });

    /*******************************************************************************************
     * Match proposal
     *******************************************************************************************/
    it('Submit a match proposal', async () => {
        await submitOffer(owner, marketplace, asset, offerVolume, offerPrice);
        await submitDemand(buyer, marketplace, demandVolume, demandPrice);

        const tx = await marketplace.proposeMatch(asset, buyer, demandVolume, offerPrice, { from: aggregator });
        const event = tx.logs[0].args;
        const offer = await marketplace.offers(asset);
        const demand = await marketplace.demands(buyer);
        const match = await marketplace.matches(1);

        assert.equal(event.__length__, 3);
        assert.equal(event.matchId.toNumber(), 1);
        assert.equal(event.asset, asset);
        assert.equal(event.buyer, buyer);

        assert.equal(offer.matches.toNumber(), 1);
        assert.equal(offer.remainingVolume.toNumber(), offerVolume - demandVolume);

        assert.equal(demand.isMatched, true);

        assert.equal(match.asset, asset);
        assert.equal(match.buyer, buyer);
        assert.equal(match.volume.toNumber(), demandVolume);
        assert.equal(match.price.toNumber(), demandPrice);
        assert.equal(match.isAccepted, false);
    });

    it('Fail to submit a match proposal with non existing offer or demand', async () => {
        // No existing offer
        await catchRevert(marketplace.proposeMatch(asset, buyer, demandVolume, offerPrice, { from: aggregator }));

        await submitOffer(owner, marketplace, asset, offerVolume, offerPrice);

        // No existing demand
        await catchRevert(marketplace.proposeMatch(asset, buyer, demandVolume, offerPrice, { from: aggregator }));
    });

    it('Fail to submit a match proposal with invalid data', async () => {
        await submitOffer(owner, marketplace, asset, offerVolume, offerPrice);
        await submitDemand(buyer, marketplace, demandVolume, demandPrice);

        await catchRevert(marketplace.proposeMatch(asset, buyer, offerVolume + 1, offerPrice, { from: aggregator }));
        await catchRevert(marketplace.proposeMatch(asset, buyer, demandVolume, offerPrice - 1, { from: aggregator }));
    });

    it('Fail to submit a match proposal not being an aggregator', async () => {
        await submitOffer(owner, marketplace, asset, offerVolume, offerPrice);
        await submitDemand(buyer, marketplace, demandVolume, demandPrice);

        await catchRevert(marketplace.proposeMatch(asset, buyer, demandVolume, offerPrice, { from: externalUser }));
    });

    /*******************************************************************************************
     * Match cancel
     *******************************************************************************************/
    it('Cancel match proposal', async () => {
        await submitMatchProposal(owner, asset, buyer, aggregator, marketplace, offerVolume, offerPrice, demandVolume, demandPrice);

        const tx = await marketplace.cancelProposedMatch(1, { from: aggregator });
        const event = tx.logs[0].args;
        const offer = await marketplace.offers(asset);
        const demand = await marketplace.demands(buyer);
        const match = await marketplace.matches(1);

        assert.equal(event.__length__, 1);
        assert.equal(event.matchId.toNumber(), 1);

        assert.equal(offer.matches.toNumber(), 0);
        assert.equal(offer.remainingVolume.toNumber(), offerVolume);

        assert.equal(demand.isMatched, false);

        assert.equal(match.volume.toNumber(), 0);
    });

    it('Fail to cancel a match proposal not being an aggregator', async () => {
        await submitMatchProposal(owner, asset, buyer, aggregator, marketplace, offerVolume, offerPrice, demandVolume, demandPrice);

        await catchRevert(marketplace.cancelProposedMatch(1, { from: externalUser }));
    });

    it('Fail to cancel a match proposal that does not exists', async () => {
        await submitMatchProposal(owner, asset, buyer, aggregator, marketplace, offerVolume, offerPrice, demandVolume, demandPrice);

        await catchRevert(marketplace.cancelProposedMatch(1, { from: externalUser }));
    });

    /*******************************************************************************************
     * Match reject
     *******************************************************************************************/
    it('Reject match proposal', async () => {
        await submitMatchProposal(owner, asset, buyer, aggregator, marketplace, offerVolume, offerPrice, demandVolume, demandPrice);

        const tx = await marketplace.rejectMatch(1, { from: buyer });
        const event = tx.logs[0].args;
        const offer = await marketplace.offers(asset);
        const demand = await marketplace.demands(buyer);
        const match = await marketplace.matches(1);

        assert.equal(event.__length__, 1);
        assert.equal(event.matchId.toNumber(), 1);

        assert.equal(offer.matches.toNumber(), 0);
        assert.equal(offer.remainingVolume.toNumber(), offerVolume);

        assert.equal(demand.isMatched, false);

        assert.equal(match.volume.toNumber(), 0);
    });

    it('Fail to reject match proposal not being the buyer', async () => {
        await submitMatchProposal(owner, asset, buyer, aggregator, marketplace, offerVolume, offerPrice, demandVolume, demandPrice);

        await catchRevert(marketplace.rejectMatch(1, { from: externalUser }));
    });

    it('Fail to reject a match proposal that does not exists', async () => {
        await catchRevert(marketplace.rejectMatch(1, { from: aggregator }));
    });

    /*******************************************************************************************
     * Match accept
     *******************************************************************************************/
    it('Accept match proposal', async () => {
        await submitMatchProposal(owner, asset, buyer, aggregator, marketplace, offerVolume, offerPrice, demandVolume, demandPrice);

        const tx = await marketplace.acceptMatch(1, { from: buyer });
        const event = tx.logs[0].args;
        const offer = await marketplace.offers(asset);
        const demand = await marketplace.demands(buyer);
        const match = await marketplace.matches(1);

        assert.equal(event.__length__, 1);
        assert.equal(event.matchId.toNumber(), 1);

        assert.equal(offer.matches.toNumber(), 1);
        assert.equal(offer.remainingVolume.toNumber(), offerVolume - demandVolume);

        assert.equal(demand.isMatched, true);

        assert.equal(match.volume.toNumber(), demandVolume);
    });

    it('Fail to accept match proposal not being the buyer', async () => {
        await submitMatchProposal(owner, asset, buyer, aggregator, marketplace, offerVolume, offerPrice, demandVolume, demandPrice);

        await catchRevert(marketplace.acceptMatch(1, { from: externalUser }));
    });

    it('Fail to accept match proposal that does not exists', async () => {
        await catchRevert(marketplace.acceptMatch(1, { from: buyer }));
    });

    /*******************************************************************************************
     * Match delete
     *******************************************************************************************/
    it('Delete match', async () => {
        await submitMatchApproved(owner, asset, buyer, aggregator, marketplace, offerVolume, offerPrice, demandVolume, demandPrice);

        const tx = await marketplace.deleteMatch(1, { from: buyer });
        const event = tx.logs[0].args;
        const offer = await marketplace.offers(asset);
        const demand = await marketplace.demands(buyer);
        const match = await marketplace.matches(1);

        assert.equal(event.__length__, 1);
        assert.equal(event.matchId.toNumber(), 1);

        assert.equal(offer.matches.toNumber(), 0);
        assert.equal(offer.remainingVolume.toNumber(), offerVolume);

        assert.equal(demand.isMatched, false);

        assert.equal(match.volume.toNumber(), 0);
    });

    it('Fail to delete match not being the buyer/owner', async () => {
        await submitMatchApproved(owner, asset, buyer, aggregator, marketplace, offerVolume, offerPrice, demandVolume, demandPrice);

        await catchRevert(marketplace.deleteMatch(1, { from: externalUser }));
    });

    it('Fail to delete match proposal that does not exists or has not been approved', async () => {
        await catchRevert(marketplace.deleteMatch(1, { from: buyer }));

        await submitMatchProposal(owner, asset, buyer, aggregator, marketplace, offerVolume, offerPrice, demandVolume, demandPrice);

        await catchRevert(marketplace.deleteMatch(1, { from: buyer }));
    });
});

async function submitOffer(account, marketplace, asset, volume, price) {
    const tx = await marketplace.createOffer(asset, volume, price, { from: account });
    const event = tx.logs[0].args;
    const offer = await marketplace.offers(asset);
    return { event, offer }
}

async function submitDemand(account, marketplace, volume, price) {
    const tx = await marketplace.createDemand(volume, price, { from: account });
    const event = tx.logs[0].args;
    const demand = await marketplace.demands(account);
    return { event, demand }
}

async function submitMatchProposal(owner, asset, buyer, aggregator, marketplace, offerVolume, offerPrice, demandVolume, demandPrice) {
    await submitOffer(owner, marketplace, asset, offerVolume, offerPrice);
    await submitDemand(buyer, marketplace, demandVolume, demandPrice);

    const tx = await marketplace.proposeMatch(asset, buyer, demandVolume, offerPrice, { from: aggregator });
    const event = tx.logs[0].args;
    const matchProposal = await marketplace.matches(1);
    return { event, matchProposal }
}

async function submitMatchApproved(owner, asset, buyer, aggregator, marketplace, offerVolume, offerPrice, demandVolume, demandPrice) {
    await submitOffer(owner, marketplace, asset, offerVolume, offerPrice);
    await submitDemand(buyer, marketplace, demandVolume, demandPrice);
    await submitMatchProposal(owner, asset, buyer, aggregator, marketplace, offerVolume, offerPrice, demandVolume, demandPrice);

    const tx = await marketplace.acceptMatch(1, { from: buyer });
    const event = tx.logs[0].args;
    const matchAccepted = await marketplace.matches(1);
    return { event, matchAccepted }
}