export const clientSchemaUID =
  "0x671de200dd06a41bc1637ae3b3ee5f8e914e3b3a9559e2feddb6a869ef64417c";

export const freelancerSchemaUID =
  "0x429ad524f39cc3fcd95c367f0f6d86ea2e5a1966c3facd7903538bb9f2f94888";

export const gigSchemaUID =
  "0xb3221d0e61e90db95e4a4c1799725caabf8ffdec227897eab359abf3fd6191fe";

export const gigAgreementUID =
  "0x09e3e1dc8c19670ccf128c657bfcb707d792921852df48ce837af27e5666322c";

export const aiAttestationSchemaUID =
  "0x784be583b872cdf051ae174d034cd499d3e5f17b35d6640e6cd052068c6b17d2";

export const gigDisputeSchemaUID =
  "0xfcbd204f6589f50e8b92031c3b256838ad1913dbbdf769b747d1ff23ef4a07f1";

export const disputeAttestationSchemaUID =
  "0x645ac1d4ea9c398ce4e5789f57269a526b925d5f92916f3391f7e1065eede38c";

export const clientSchema =
  "string clientName,address clientAddress,string clientBio,string[] category,uint256 reputationScore,uint256 noOfJobsPosted,uint256 noOfDisputesRaised,uint256 noOfDisputesWon";

export const freelancerSchema =
  "string freelancerName,address freelancerAddress,string freelancerBio,string[] skills,uint256 reputationScore,uint256 noOfGigsCompleted,uint256 noOfDisputesArised,uint256 noOfDisputesWon";

export const gigSchema =
  "string gigTitle,string gigDescription,string[] gigTags,uint256 gigBudget,uint256 gigDeadliine,address gigClient,bytes32 gigClientUID,address gigContractAddress";

export const gigAgreement =
  "string gigTitle,bytes32 refUID,string gigDescription,uint256 gigDeadline,uint256 gigBudget,bytes32 gigClientUID,bytes32 gigApplicantUID,address gigContractAddress";

export const aiAttestationSchema =
  "bytes32 refUID,uint256 aiScore,string aiFeedback,bytes32 freelancerUID,string videoIpfsHash";

export const gigDisputeSchema =
  "bytes32 refUID,string disputeDescription,bytes32 clientUID,bytes32 freelancerUID";

export const disputeAttestationSchema =
  "bytes32 refUID,bytes32 validatorUID,address validatorAddress,uint256 clientFavor,string validationDescripton";

export const gigFactoryAddress = "0xd62378a75cfed3644d39bce139a40d3b27027fb1";
// 0xd62378a75cfed3644d39bce139a40d3b27027fb1; - redeployed contract
// 0xc13d441ed0e004aa019cdee5795b79a571bcbe9f; -v1 contract
