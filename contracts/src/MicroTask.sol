// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title MicroTask
/// @notice Micro-task marketplace with golden-key on-chain judging.
///         Creators escrow MON and store a golden answer key. The contract
///         grades every submission against that key and pays out instantly —
///         no middlemen, no pending phase, everything verifiable on-chain.
contract MicroTask {
    uint256 public constant MAX_FRAMES = 500;

    /// @dev Protocol fee in basis points. 200 == 2%.
    uint256 public protocolFee;

    address public immutable owner;

    uint256 public taskCount;

    struct Task {
        uint256 id;
        address creator;
        string title;
        string description;
        string category;
        uint256 reward; // wei paid per correct frame (pre-fee)
        uint256 bounty; // MON still locked in escrow
        uint256 completed; // frames correctly paid
        uint256 rejected; // wrong submissions
        uint256 pending; // always 0 under instant golden-key checking
        uint256 frameCount;
        bool active;
    }

    mapping(uint256 => Task) public tasks;

    /// @dev taskId => frameId => golden option + 1 (0 = unset)
    mapping(uint256 => mapping(uint256 => uint8)) private _golden;

    /// @dev taskId => frameId => frame already paid to a worker
    mapping(uint256 => mapping(uint256 => bool)) private _framePaid;

    mapping(address => uint32) private _correct;
    mapping(address => uint32) private _attempted;

    uint256 public accumulatedFees;

    event TaskCreated(uint256 indexed id, address creator, string category, uint256 reward);
    event AnswerAccepted(uint256 indexed taskId, uint256 frameId, address worker, uint256 amount);
    event AnswerRejected(uint256 indexed taskId, uint256 frameId, address worker, uint8 option);
    event AnswerPending(uint256 indexed taskId, uint256 frameId, address worker, uint8 option);
    event TaskClosed(uint256 indexed taskId);

    constructor() {
        owner = msg.sender;
        protocolFee = 200;
    }

    function createTask(
        string calldata title,
        string calldata description,
        string calldata category,
        uint256 rewardPerFrame,
        uint256 frameCount,
        uint256[] calldata goldenFrameIndices,
        uint8[] calldata correctAnswers
    ) external payable returns (uint256 id) {
        require(rewardPerFrame > 0, "reward must be > 0");
        require(frameCount > 0 && frameCount <= MAX_FRAMES, "bad frame count");
        require(goldenFrameIndices.length > 0, "empty golden key");
        require(goldenFrameIndices.length == correctAnswers.length, "key length mismatch");
        require(msg.value >= rewardPerFrame * goldenFrameIndices.length, "escrow too small");

        id = taskCount++;
        tasks[id] = Task({
            id: id,
            creator: msg.sender,
            title: title,
            description: description,
            category: category,
            reward: rewardPerFrame,
            bounty: msg.value,
            completed: 0,
            rejected: 0,
            pending: 0,
            frameCount: frameCount,
            active: true
        });

        for (uint256 i = 0; i < goldenFrameIndices.length; i++) {
            uint256 frame = goldenFrameIndices[i];
            require(frame < frameCount, "frame out of range");
            uint8 option = correctAnswers[i];
            require(option < 255, "bad option");
            _golden[id][frame] = option + 1;
        }

        emit TaskCreated(id, msg.sender, category, rewardPerFrame);
    }

    function submitAnswer(uint256 taskId, uint256 frameId, uint8 option) external {
        Task storage t = tasks[taskId];
        require(t.active, "task closed");
        require(frameId < t.frameCount, "frame out of range");

        uint8 golden = _golden[taskId][frameId];
        require(golden != 0, "no golden answer for frame");

        if (option == golden - 1) {
            require(!_framePaid[taskId][frameId], "frame already claimed");
            _framePaid[taskId][frameId] = true;

            uint256 fee = (t.reward * protocolFee) / 10_000;
            uint256 payout = t.reward - fee;

            t.completed += 1;
            t.bounty -= payout;
            accumulatedFees += fee;

            _correct[msg.sender] += 1;
            _attempted[msg.sender] += 1;

            (bool ok, ) = payable(msg.sender).call{value: payout}("");
            require(ok, "payout failed");

            emit AnswerAccepted(taskId, frameId, msg.sender, payout);
        } else {
            t.rejected += 1;
            _attempted[msg.sender] += 1;
            emit AnswerRejected(taskId, frameId, msg.sender, option);
        }
    }

    function closeTask(uint256 taskId) external {
        Task storage t = tasks[taskId];
        require(msg.sender == t.creator, "not creator");
        require(t.active, "task already closed");

        t.active = false;
        emit TaskClosed(taskId);

        uint256 remaining = t.bounty;
        t.bounty = 0;
        if (remaining > 0) {
            (bool ok, ) = payable(msg.sender).call{value: remaining}("");
            require(ok, "refund failed");
        }
    }

    function withdrawFees() external {
        require(msg.sender == owner, "not owner");
        uint256 amount = accumulatedFees;
        accumulatedFees = 0;
        (bool ok, ) = payable(owner).call{value: amount}("");
        require(ok, "withdraw failed");
    }

    function accuracyOf(address worker) external view returns (uint32 correct, uint32 attempted) {
        return (_correct[worker], _attempted[worker]);
    }
}