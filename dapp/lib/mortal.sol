pragma solidity ^0.4.24;

import "./owned.sol";

contract mortal is owned {
    function kill() public {
        if (msg.sender == owner)
            selfdestruct(owner);
    }
}
