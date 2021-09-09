// TODO: deploy marketplace

const Marketplace = artifacts.require("./Marketplace/Marketplace.sol");
const IdentityManager = artifacts.require("./Identity/IdentityManager.sol");
const OfferableIdentity = artifacts.require("./Identity/OfferableIdentity.sol");

const getOfferableIdentityAddress = async function (deployer) {
    try {
        const offerableIdentity = await OfferableIdentity.deployed();
        console.log(`OfferableIdentity was already deployed at ${newOfferableIdentity.address}`);
        return offerableIdentity.address;
    } catch {
        const newOfferableIdentity = await deployer.deploy(OfferableIdentity);
        console.log(`OfferableIdentity deployed at ${newOfferableIdentity.address}`);
        return newOfferableIdentity.address;
    }
}

const getIdentityManagerAddress = async function (deployer) {
    try {
        const identityManager = await IdentityManager.deployed();
        console.log(`IdentityManager was already deployed at ${newIdentityManager.address}`);
        return identityManager.address;
    } catch {
        const newIdentityManager = await deployer.deploy(IdentityManager, await getOfferableIdentityAddress(deployer));
        console.log(`IdentityManager deployed at ${newIdentityManager.address}`);
        return newIdentityManager.address;
    }
}

module.exports = async function (deployer) {
    let identityManagerAddress = process.env.IDENTITY_MANAGER_ADDRESS || await getIdentityManagerAddress(deployer);

    await deployer.deploy(Marketplace, identityManagerAddress);
    const marketplace = await Marketplace.deployed();
    console.log(`Marketplace deployed at ${marketplace.address}`);
};