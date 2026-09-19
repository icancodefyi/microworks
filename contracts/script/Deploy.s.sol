// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script, console2} from "forge-std/Script.sol";
import {MicroTask} from "../src/MicroTask.sol";

contract Deploy is Script {
    function run() external {
        uint256 deployerPk = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPk);

        vm.startBroadcast(deployerPk);
        MicroTask microTask = new MicroTask();
        vm.stopBroadcast();

        console2.log("Deployer:", deployer);
        console2.log("MicroTask deployed at:", address(microTask));
        console2.log("taskCount:", microTask.taskCount());
        console2.log("protocolFee (bps):", microTask.protocolFee());
    }
}