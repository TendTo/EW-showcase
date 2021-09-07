// TODO: deploy marketplace

const Marketplace = artifacts.require("./Marketplace/Marketplace.sol");
const IdentityManager = artifacts.require("./Identity/IdentityManager.sol");
const OfferableIdentity = artifacts.require("./Identity/OfferableIdentity.sol");

const getOfferableIdentityAddress = async function (deployer) {
    try {
        const offerableIdentity = await OfferableIdentity.deployed();
        return offerableIdentity.address;
    } catch {
        const newOfferableIdentity = await deployer.deploy(OfferableIdentity);
        return newOfferableIdentity.address;
    }
}

const getIdentityManagerAddress = async function (deployer) {
    try {
        const identityManager = await IdentityManager.deployed();
        return identityManager.address;
    } catch {
        const newIdentityManager = await deployer.deploy(IdentityManager, await getOfferableIdentityAddress(deployer));
        return newIdentityManager.address;
    }
}

module.exports = async function (deployer) {
    let identityManagerAddress = process.env.IDENTITY_MANAGER_ADDRESS || await getIdentityManagerAddress(deployer);

    await deployer.deploy(Marketplace, identityManagerAddress);
    const marketplace = await Marketplace.deployed();
    console.log(`Marketplace deployed at ${marketplace.address}`);
};