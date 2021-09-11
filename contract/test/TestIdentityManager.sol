// SPDX-License-Identifier: MIT
pragma solidity >=0.8.4 <0.9.0;

import "truffle/build/Assert.sol";
import "../contracts/Identity/IdentityManager.sol";
import "../contracts/Identity/OfferableIdentity.sol";

contract TestIdentityManager {
    OfferableIdentity private _offerableIdentityAddress;
    IdentityManager private _identityManager;
    address private constant _owner = address(0x1);

    function beforeAll() public {
        _offerableIdentityAddress = new OfferableIdentity();
    }

    function beforeEach() public {
        _identityManager = new IdentityManager(
            address(_offerableIdentityAddress)
        );
    }
}
