// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract GigContract {
    uint256 public gigId;
    address public client;
    address public freelancer;
    string public description;
    uint256 public budget;
    uint256 public deadline;
    uint256 public fundsDeposited;
    string public attestationUID; // Attestation UID for agreement
    string public aiAttestationUID; // AI attestation for work evaluation
    string public disputeAttestationUID; // Dispute attestation UID
    bool public isAccepted;
    bool public isCompleted;
    bool public isDisputed;

    uint256 public aiScore; // AI evaluated score for the work
    address public disputingParty; // Tracks who raised the dispute
    string public disputeDescription; // Description of the dispute

    struct Applicant {
        address freelancerAddress;
        string proposal;
    }

    Applicant[] public applicants;

    mapping(address => bool) public hasApplied;

    event GigApplied(uint256 indexed gigId,address indexed freelancer, string proposal);
    event GigAccepted(uint256 indexed gigId,address indexed freelancer, string attestationUID);
    event WorkSubmitted(uint256 indexed gigId,bytes32 indexed workHash, uint256 aiScore, string aiAttestationUID);
    event DisputeRaised(uint256 indexed gigId,address indexed disputingParty, string disputeAttestationUID, string description);
    event DisputeResolved(
        uint256 indexed gigId,
        string indexed disputeAttestationUID,
        string decision,
        uint256 payout
    );
    event PaymentReleased(uint256 indexed gigId,address indexed recipient, uint256 amount);

    modifier onlyClient() {
        require(msg.sender == client, "Only client can call this function");
        _;
    }

    modifier onlyFreelancer() {
        require(msg.sender == freelancer, "Only freelancer can call this function");
        _;
    }

    modifier GigNotCompleted() {
        require(!isCompleted, "Gig is already completed");
        _;
    }

    // modifier onlyTrustGigz(){
    //     require(msg.sender == 0x4b4b30e2E7c6463b03CdFFD6c42329D357205334,"Only TrustGigz Platform can resolve the dispute");
    //     _;
    // }

    constructor(
        address _client,
        uint256 _gigId,
        string memory _description,
        uint256 _budget,
        uint256 _deadline
    ) payable {
        require(msg.value == _budget, "Initial deposit must match the budget");
        client = _client;
        gigId = _gigId;
        description = _description;
        budget = _budget;
        deadline = _deadline;
        fundsDeposited = msg.value;
    }

    function applyForGig(string calldata proposal) external {
        require(!isAccepted, "Gig already accepted");
        require(!hasApplied[msg.sender], "You have already applied for this Gig");

        applicants.push(Applicant({
            freelancerAddress: msg.sender,
            proposal: proposal
        }));

        hasApplied[msg.sender] = true;
        emit GigApplied(gigId,msg.sender, proposal);
    }

    function chooseFreelancer(uint256 applicantIndex, string calldata _attestationUID) 
        external 
        onlyClient 
        GigNotCompleted 
    {
        require(applicantIndex < applicants.length, "Invalid applicant index");

        Applicant memory selectedApplicant = applicants[applicantIndex];
        freelancer = selectedApplicant.freelancerAddress;
        attestationUID = _attestationUID;
        isAccepted = true;

        emit GigAccepted(gigId,freelancer, attestationUID);
    }

    function submitWork(
        bytes32 workHash,
        uint256 _aiScore,
        string calldata _aiAttestationUID
    ) external onlyFreelancer GigNotCompleted {
        require(isAccepted, "Gig not accepted yet");
        require(_aiScore <= 100, "AI Score must be within 0 to 100");

        aiScore = _aiScore;
        aiAttestationUID = _aiAttestationUID;

        emit WorkSubmitted(gigId,workHash, aiScore, aiAttestationUID);
    }

    function raiseDispute(
        string calldata _disputeAttestationUID,
        string calldata _description
    ) external {
        require(msg.sender == client || msg.sender == freelancer, "Not authorized to raise a dispute");
        require(!isCompleted, "Cannot dispute a completed Gig");

        isDisputed = true;
        disputingParty = msg.sender;
        disputeDescription = _description;
        disputeAttestationUID = _disputeAttestationUID;

        emit DisputeRaised(gigId,msg.sender, _disputeAttestationUID, _description);
    }

    function resolveDispute(
    uint256 clientVotePercentage, // Average percentage of votes in favor of the client (0-100)
    uint256 freelancerVotePercentage // Average percentage of votes in favor of the freelancer (0-100)
) external  {
    require(isDisputed, "No dispute to resolve");
    require(clientVotePercentage + freelancerVotePercentage == 100, "Vote percentages must add up to 100");
    require(aiScore <= 100, "AI Score must be within 0 to 100");

    // Weighted scores
    uint256 aiWeightedScore = (aiScore * 30) / 100;
    uint256 freelancerValidatorWeightedScore = (freelancerVotePercentage * 70) / 100;
    uint256 clientValidatorWeightedScore = (clientVotePercentage * 70) / 100;

    // Final weighted scores
    uint256 freelancerFinalScore = aiWeightedScore + freelancerValidatorWeightedScore;
    uint256 clientFinalScore = (100 - aiWeightedScore) + clientValidatorWeightedScore;

    uint256 payout;

    if (freelancerFinalScore >= clientFinalScore) {
        // Freelancer wins
        isCompleted = true;
        payout = fundsDeposited;
        payable(freelancer).transfer(fundsDeposited);
        emit DisputeResolved( gigId,disputeAttestationUID,"In favor of Freelancer", payout);
    } else {
        // Client wins
        isCompleted = true;
        payout = fundsDeposited;
        payable(client).transfer(fundsDeposited);
        emit DisputeResolved(gigId,disputeAttestationUID, "In favor of Client", payout);
    }

    isDisputed = false;
}


    function getApplicants() external view returns (Applicant[] memory) {
        return applicants;
    }
}
