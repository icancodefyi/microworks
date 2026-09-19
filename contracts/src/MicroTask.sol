// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title MicroTask
/// @notice Micro-task marketplace with golden-key on-chain judging and gamification.
///         Creators escrow MON and submit a golden answer hash per frame. The
///         contract grades every submission against that hash and pays out
///         instantly — proving the answer on-chain with zero review latency.
///         Every correct answer also mints XP, tracks win & daily streaks and
///         feeds a public leaderboard.
contract MicroTask {
    uint256 public constant MAX_FRAMES = 500;

    /// @dev XP granted per correct answer.
    uint256 public constant XP_PER_CORRECT = 100;

    /// @dev Task kinds: 0 = options, 1 = yes/no, 2 = rating, 3 = free text.
    uint8 public constant KIND_OPTIONS = 0;
    uint8 public constant KIND_YESNO = 1;
    uint8 public constant KIND_RATING = 2;
    uint8 public constant KIND_TEXT = 3;

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
        uint8 kind;
        uint8 optionCount;
        string[] options;
        uint256 reward; // wei paid per correct frame (pre-fee)
        uint256 bounty; // MON still locked in escrow
        uint256 completed; // frames correctly paid
        uint256 rejected; // wrong submissions
        uint256 frameCount;
        bool active;
    }

    mapping(uint256 => Task) public tasks;

    function getTask(uint256 taskId) external view returns (Task memory) {
        return tasks[taskId];
    }

    /// @dev taskId => frameId => golden answer hash (keccak of canonical answer)
    mapping(uint256 => mapping(uint256 => bytes32)) private _golden;

    /// @dev taskId => frameId => frame already paid to a worker
    mapping(uint256 => mapping(uint256 => bool)) private _framePaid;

    uint256 public accumulatedFees;

    // --- Gamification ---

    mapping(address => uint256) public points;
    mapping(address => uint32) public winStreak; // consecutive correct answers
    mapping(address => uint32) public dayStreak; // consecutive active days
    mapping(address => uint48) public lastCorrectDay; // day index (ts / 86400)

    address[] private _workers;
    mapping(address => bool) private _isWorker;

    event TaskCreated(uint256 indexed id, address creator, string category, uint256 reward);
    event AnswerAccepted(uint256 indexed taskId, uint256 frameId, address worker, uint256 amount);
    event AnswerRejected(uint256 indexed taskId, uint256 frameId, address worker, uint8 option);
    event AnswerPending(uint256 indexed taskId, uint256 frameId, address worker, uint8 option);
    event TaskClosed(uint256 indexed taskId);
    event XpEarned(address indexed worker, uint256 points, uint32 winStreak, uint32 dayStreak);

    constructor() {
        owner = msg.sender;
        protocolFee = 200;
    }

    function createTask(
        string calldata title,
        string calldata description,
        string calldata category,
        uint8 kind,
        uint8 optionCount,
        string[] calldata options,
        uint256 rewardPerFrame,
        uint256 frameCount,
        bytes32[] calldata goldenAnswers
    ) external payable returns (uint256 id) {
        require(rewardPerFrame > 0, "reward must be > 0");
        require(frameCount > 0 && frameCount <= MAX_FRAMES, "bad frame count");
        require(goldenAnswers.length == frameCount, "answer key must cover every frame");
        require(kind <= KIND_TEXT, "bad kind");
        if (kind == KIND_OPTIONS) {
            require(optionCount >= 2, "need >= 2 options");
            require(options.length == optionCount, "options mismatch");
        }
        require(msg.value >= rewardPerFrame * frameCount, "escrow too small");

        id = taskCount++;
        tasks[id] = Task({
            id: id,
            creator: msg.sender,
            title: title,
            description: description,
            category: category,
            kind: kind,
            optionCount: kind == KIND_OPTIONS ? optionCount : (kind == KIND_YESNO ? 2 : (kind == KIND_RATING ? 5 : 0)),
            options: options,
            reward: rewardPerFrame,
            bounty: msg.value,
            completed: 0,
            rejected: 0,
            frameCount: frameCount,
            active: true
        });

        for (uint256 i = 0; i < goldenAnswers.length; i++) {
            _golden[id][i] = goldenAnswers[i];
        }

        emit TaskCreated(id, msg.sender, category, rewardPerFrame);
    }

    /// @dev Judge an answer. `answer` is the keccak256 of the canonical answer
    ///      payload. For options/yesno/rating that is a single byte encoding the
    ///      chosen option; for free text it is the normalized text hash.
    function submitAnswer(uint256 taskId, uint256 frameId, bytes32 answer) external {
        Task storage t = tasks[taskId];
        require(t.active, "task closed");
        require(frameId < t.frameCount, "frame out of range");

        bytes32 golden = _golden[taskId][frameId];
        require(golden != bytes32(0), "no answer key for frame");

        if (answer == golden) {
            require(!_framePaid[taskId][frameId], "frame already claimed");
            _framePaid[taskId][frameId] = true;

            uint256 fee = (t.reward * protocolFee) / 10000;
            uint256 payout = t.reward - fee;
            accumulatedFees += fee;
            t.bounty -= t.reward;
            t.completed += 1;

            _grantPoints(msg.sender);

            emit AnswerAccepted(taskId, frameId, msg.sender, payout);

            (bool ok, ) = msg.sender.call{value: payout}("");
            require(ok, "payout failed");

            if (t.bounty == 0) t.active = false;
        } else {
            t.rejected += 1;
            winStreak[msg.sender] = 0;
            emit AnswerRejected(taskId, frameId, msg.sender, uint8(answer[0]));
        }
    }

    function closeTask(uint256 taskId) external {
        Task storage t = tasks[taskId];
        require(t.active, "not active");
        require(msg.sender == t.creator || msg.sender == owner, "not authorized");
        uint256 refund = t.bounty;
        t.bounty = 0;
        t.active = false;
        if (refund > 0) {
            (bool ok, ) = t.creator.call{value: refund}("");
            require(ok, "withdraw failed");
        }
        emit TaskClosed(taskId);
    }

    function withdrawFees() external {
        require(msg.sender == owner, "not owner");
        uint256 amount = accumulatedFees;
        accumulatedFees = 0;
        (bool ok, ) = owner.call{value: amount}("");
        require(ok, "withdraw failed");
    }

    function _grantPoints(address worker) internal {
        points[worker] += XP_PER_CORRECT;
        uint32 win = winStreak[worker] + 1;
        winStreak[worker] = win;

        uint48 today = uint48(block.timestamp / 86400) + 1; // +1 so 0 means "never"
        uint48 last = lastCorrectDay[worker];
        if (last == 0 || last < today - 1) {
            dayStreak[worker] = 1;
        } else if (last == today - 1) {
            dayStreak[worker] += 1;
        }
        lastCorrectDay[worker] = today;

        if (!_isWorker[worker]) {
            _isWorker[worker] = true;
            _workers.push(worker);
        }

        emit XpEarned(worker, points[worker], win, dayStreak[worker]);
    }

    function getLeaderboard(uint256 limit)
        external
        view
        returns (address[] memory addrs, uint256[] memory pts, uint32[] memory wins, uint32[] memory streakDays)
    {
        uint256 total = _workers.length;
        uint256 n = total < limit ? total : limit;

        address[] memory all = new address[](total);
        uint256[] memory allPts = new uint256[](total);
        uint32[] memory allWins = new uint32[](total);
        uint32[] memory allDays = new uint32[](total);

        for (uint256 i = 0; i < total; i++) {
            address w = _workers[i];
            all[i] = w;
            allPts[i] = points[w];
            allWins[i] = winStreak[w];
            allDays[i] = dayStreak[w];
        }

        for (uint256 i = 1; i < total; i++) {
            uint256 j = i;
            while (j > 0 && allPts[j] > allPts[j - 1]) {
                (all[j], all[j - 1]) = (all[j - 1], all[j]);
                (allPts[j], allPts[j - 1]) = (allPts[j - 1], allPts[j]);
                (allWins[j], allWins[j - 1]) = (allWins[j - 1], allWins[j]);
                (allDays[j], allDays[j - 1]) = (allDays[j - 1], allDays[j]);
                j--;
            }
        }

        addrs = new address[](n);
        pts = new uint256[](n);
        wins = new uint32[](n);
        streakDays = new uint32[](n);

        for (uint256 i = 0; i < n; i++) {
            addrs[i] = all[i];
            pts[i] = allPts[i];
            wins[i] = allWins[i];
            streakDays[i] = allDays[i];
        }
    }
}