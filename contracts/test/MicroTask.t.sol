// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {MicroTask} from "../src/MicroTask.sol";

contract MicroTaskTest is Test {
    MicroTask public mt;

    address public creator = makeAddr("creator");
    address public worker = makeAddr("worker");
    address public attacker = makeAddr("attacker");

    receive() external payable {}

    function setUp() public {
        // owner becomes this test contract
        mt = new MicroTask();
    }

    function _createTask() internal returns (uint256 id) {
        uint256[] memory indices = new uint256[](3);
        indices[0] = 0;
        indices[1] = 1;
        indices[2] = 2;
        uint8[] memory options = new uint8[](3);
        options[0] = 0;
        options[1] = 2;
        options[2] = 1;

        vm.deal(creator, 1 ether);
        vm.prank(creator);
        id = mt.createTask{value: 0.3 ether}(
            "Label frames", "Label each frame", "label", 0.1 ether, 3, indices, options
        );
    }

    function test_CreateTask_StoresEscrowAndEmits() public {
        _createTask();

        (uint256 id, address c, , , , uint256 reward, uint256 bounty, , , , , bool active) = mt.tasks(0);
        assertEq(id, 0);
        assertEq(c, creator);
        assertEq(reward, 0.1 ether);
        assertEq(bounty, 0.3 ether);
        assertTrue(active);
        assertEq(mt.taskCount(), 1);
    }

    function test_CorrectAnswer_PaysOutMinusFee() public {
        _createTask();
        uint256 fee = (0.1 ether * mt.protocolFee()) / 10_000;
        uint256 payout = 0.1 ether - fee;

        uint256 workerBal = worker.balance;
        vm.prank(worker);
        mt.submitAnswer(0, 0, 0);

        assertEq(worker.balance - workerBal, payout);
        (, , , , , , , uint256 completed, , , , ) = mt.tasks(0);
        assertEq(completed, 1);
        (uint32 correct, uint32 attempted) = mt.accuracyOf(worker);
        assertEq(correct, 1);
        assertEq(attempted, 1);
        assertGt(mt.accumulatedFees(), 0);
    }

    function test_WrongAnswer_RejectedNoPayout() public {
        _createTask();
        uint256 workerBal = worker.balance;
        vm.prank(worker);
        mt.submitAnswer(0, 1, 0); // golden is 2

        assertEq(worker.balance, workerBal);
        (, , , , , , , , uint256 rejected, , , ) = mt.tasks(0);
        assertEq(rejected, 1);
        (uint32 correct, uint32 attempted) = mt.accuracyOf(worker);
        assertEq(correct, 0);
        assertEq(attempted, 1);
    }

    function test_FramePaidOnce_SecondClaimReverts() public {
        _createTask();
        vm.prank(worker);
        mt.submitAnswer(0, 0, 0);

        address worker2 = makeAddr("worker2");
        vm.deal(worker2, 1 ether);
        vm.prank(worker2);
        vm.expectRevert("frame already claimed");
        mt.submitAnswer(0, 0, 0);
    }

    function test_CloseTask_RefundsRemaining() public {
        _createTask();
        vm.prank(worker);
        mt.submitAnswer(0, 0, 0);

        uint256 creatorBal = creator.balance;
        vm.prank(creator);
        mt.closeTask(0);

        assertGt(creator.balance - creatorBal, 0);
        ( , , , , , , , , , , , bool active) = mt.tasks(0);
        assertFalse(active);
    }

    function test_CloseTask_OnlyCreator() public {
        _createTask();
        vm.prank(attacker);
        vm.expectRevert("not creator");
        mt.closeTask(0);
    }

    function test_WithdrawFees_OnlyOwner() public {
        _createTask();
        vm.prank(worker);
        mt.submitAnswer(0, 0, 0);

        uint256 feesBefore = mt.accumulatedFees();
        assertGt(feesBefore, 0);

        uint256 ownerBal = address(this).balance;
        mt.withdrawFees();
        assertEq(address(this).balance - ownerBal, feesBefore);
        assertEq(mt.accumulatedFees(), 0);

        vm.prank(attacker);
        vm.expectRevert("not owner");
        mt.withdrawFees();
    }

    function test_Rejects_InvalidInputs() public {
        vm.deal(creator, 1 ether);
        uint256[] memory indices = new uint256[](1);
        indices[0] = 0;
        uint8[] memory options = new uint8[](1);
        options[0] = 0;

        // empty escrow
        vm.prank(creator);
        vm.expectRevert("escrow too small");
        mt.createTask{value: 0}("t", "d", "label", 0.1 ether, 1, indices, options);
    }
}