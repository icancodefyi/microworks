// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {MicroTask} from "../src/MicroTask.sol";

contract MicroTaskTest is Test {
    MicroTask public mt;

    address public creator = makeAddr("creator");
    address public worker = makeAddr("worker");
    address public worker2 = makeAddr("worker2");
    address public attacker = makeAddr("attacker");

    uint8 private constant KIND_OPTIONS = 0;
    uint8 private constant KIND_YESNO = 1;
    uint8 private constant KIND_RATING = 2;
    uint8 private constant KIND_TEXT = 3;

    receive() external payable {}

    function setUp() public {
        // owner becomes this test contract
        mt = new MicroTask();
    }

    function _ans8(uint8 o) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked(o));
    }

    function _ansText(string memory s) internal pure returns (bytes32) {
        return keccak256(bytes(s));
    }

    function _makeOptions(uint256 n) internal pure returns (string[] memory) {
        string[] memory options = new string[](n);
        for (uint256 i = 0; i < n; i++) options[i] = string(abi.encodePacked("option-", _toStr(i)));
        return options;
    }

    function _toStr(uint256 v) internal pure returns (string memory) {
        if (v == 0) return "0";
        uint256 tmp = v;
        uint256 digits;
        while (tmp != 0) {
            digits++;
            tmp /= 10;
        }
        bytes memory b = new bytes(digits);
        while (v != 0) {
            digits -= 1;
            b[digits] = bytes1(uint8(48 + (v % 10)));
            v /= 10;
        }
        return string(b);
    }

    function _createTask() internal returns (uint256 id) {
        string[] memory options = _makeOptions(3);
        bytes32[] memory golden = new bytes32[](3);
        golden[0] = _ans8(0);
        golden[1] = _ans8(2);
        golden[2] = _ans8(1);

        vm.deal(creator, 1 ether);
        vm.prank(creator);
        id = mt.createTask{value: 0.3 ether}(
            "Label frames", "Label each frame", "label", KIND_OPTIONS, 3, options, 0.1 ether, 3, golden
        );
    }

    function test_CreateTask_StoresEscrowAndKind() public {
        _createTask();

        MicroTask.Task memory t = mt.getTask(0);
        assertEq(t.id, 0);
        assertEq(t.creator, creator);
        assertEq(t.kind, KIND_OPTIONS);
        assertEq(t.optionCount, 3);
        assertEq(t.reward, 0.1 ether);
        assertEq(t.bounty, 0.3 ether);
        assertEq(t.frameCount, 3);
        assertTrue(t.active);
        assertEq(mt.taskCount(), 1);
    }

    function test_CorrectAnswer_PaysOutMintsXpAndStreak() public {
        _createTask();
        uint256 fee = (0.1 ether * mt.protocolFee()) / 10_000;
        uint256 payout = 0.1 ether - fee;

        uint256 workerBal = worker.balance;
        vm.prank(worker);
        vm.expectEmit(true, true, true, true);
        emit MicroTask.AnswerAccepted(0, 0, worker, payout);
        mt.submitAnswer(0, 0, _ans8(0));

        assertEq(worker.balance - workerBal, payout);
        assertEq(mt.getTask(0).completed, 1);
        assertEq(mt.points(worker), mt.XP_PER_CORRECT());
        assertEq(mt.winStreak(worker), 1);
        assertEq(mt.dayStreak(worker), 1);
        assertGt(mt.accumulatedFees(), 0);
    }

    function test_ConsecutiveCorrect_IncrementsWinStreak() public {
        _createTask();
        vm.prank(worker);
        mt.submitAnswer(0, 0, _ans8(0));
        vm.prank(worker);
        mt.submitAnswer(0, 1, _ans8(2));
        assertEq(mt.winStreak(worker), 2);
        assertEq(mt.points(worker), 2 * mt.XP_PER_CORRECT());
        assertEq(mt.dayStreak(worker), 1); // same day
    }

    function test_WrongAnswer_RejectedResetsWinStreak() public {
        _createTask();
        vm.prank(worker);
        mt.submitAnswer(0, 0, _ans8(0));
        assertEq(mt.winStreak(worker), 1);

        uint256 workerBal = worker.balance;
        vm.prank(worker);
        mt.submitAnswer(0, 1, _ans8(0)); // golden is 2
        assertEq(worker.balance, workerBal);
        assertEq(mt.getTask(0).rejected, 1);
        assertEq(mt.winStreak(worker), 0);
        assertEq(mt.points(worker), mt.XP_PER_CORRECT());
    }

    function test_DailyStreak_OnlyWhenConsecutiveDays() public {
        _createTask();
        vm.prank(worker);
        mt.submitAnswer(0, 0, _ans8(0));
        assertEq(mt.dayStreak(worker), 1);

        // Next day: streak grows to 2
        vm.warp(block.timestamp + 86400);
        vm.prank(worker);
        mt.submitAnswer(0, 1, _ans8(2));
        assertEq(mt.dayStreak(worker), 2);

        // Same day again: stays 2
        vm.prank(worker);
        mt.submitAnswer(0, 2, _ans8(1));
        assertEq(mt.dayStreak(worker), 2);

        // Skip 3 days: resets to 1
        vm.warp(block.timestamp + 3 * 86400);
        uint256 id = _createTextureTask();
        vm.prank(worker);
        mt.submitAnswer(id, 0, _ansText("safe"));
        assertEq(mt.dayStreak(worker), 1);
    }

    function test_FramePaidOnce_SecondClaimReverts() public {
        _createTask();
        vm.prank(worker);
        mt.submitAnswer(0, 0, _ans8(0));

        vm.deal(worker2, 1 ether);
        vm.prank(worker2);
        vm.expectRevert("frame already claimed");
        mt.submitAnswer(0, 0, _ans8(0));
    }

    function test_TextTask_JudgesByHash() public {
        uint256 id = _createTextureTask();
        vm.prank(worker);
        mt.submitAnswer(id, 0, _ansText("safe"));
        assertEq(mt.getTask(id).completed, 1);

        vm.prank(worker2);
        mt.submitAnswer(id, 1, _ansText("WRONG"));
        assertEq(mt.getTask(id).rejected, 1);
    }

    function _createTextureTask() internal returns (uint256 id) {
        string[] memory empty = new string[](0);
        bytes32[] memory golden = new bytes32[](2);
        golden[0] = _ansText("safe");
        golden[1] = _ansText("dangerous");
        vm.deal(creator, 1 ether);
        vm.prank(creator);
        id = mt.createTask{value: 0.2 ether}(
            "Scene verdict", "Is this scene safe?", "verify", KIND_TEXT, 0, empty, 0.1 ether, 2, golden
        );
    }

    function test_Leaderboard_RanksByPoints() public {
        _createTask();
        vm.prank(worker);
        mt.submitAnswer(0, 0, _ans8(0));
        vm.prank(worker);
        mt.submitAnswer(0, 1, _ans8(2));

        vm.deal(worker2, 1 ether);
        vm.prank(worker2);
        mt.submitAnswer(0, 2, _ans8(1));

        (address[] memory addrs, uint256[] memory pts, uint32[] memory wins, uint32[] memory streakDays) =
            mt.getLeaderboard(10);

        assertEq(addrs[0], worker); // 200 XP first
        assertEq(pts[0], 2 * mt.XP_PER_CORRECT());
        assertEq(addrs[1], worker2);
        assertEq(pts[1], mt.XP_PER_CORRECT());
        assertEq(wins[0], 2);
        assertEq(streakDays[0], 1);
    }

    function test_CloseTask_RefundsRemaining() public {
        _createTask();
        vm.prank(worker);
        mt.submitAnswer(0, 0, _ans8(0));

        uint256 creatorBal = creator.balance;
        vm.prank(creator);
        mt.closeTask(0);

        assertGt(creator.balance - creatorBal, 0);
        assertFalse(mt.getTask(0).active);
    }

    function test_CloseTask_OnlyCreatorOrOwner() public {
        _createTask();
        vm.prank(attacker);
        vm.expectRevert("not authorized");
        mt.closeTask(0);
    }

    function test_WithdrawFees_OnlyOwner() public {
        _createTask();
        vm.prank(worker);
        mt.submitAnswer(0, 0, _ans8(0));

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
        string[] memory options = _makeOptions(2);
        bytes32[] memory golden = new bytes32[](1);
        golden[0] = _ans8(0);

        // empty escrow
        vm.prank(creator);
        vm.expectRevert("escrow too small");
        mt.createTask{value: 0}("t", "d", "label", KIND_OPTIONS, 2, options, 0.1 ether, 1, golden);

        // key length mismatch
        bytes32[] memory short = new bytes32[](0);
        vm.prank(creator);
        vm.expectRevert("answer key must cover every frame");
        mt.createTask{value: 0.1 ether}("t", "d", "label", KIND_OPTIONS, 2, options, 0.1 ether, 1, short);

        // bad kind
        vm.prank(creator);
        vm.expectRevert("bad kind");
        mt.createTask{value: 0.1 ether}("t", "d", "label", 99, 2, options, 0.1 ether, 1, golden);
    }
}