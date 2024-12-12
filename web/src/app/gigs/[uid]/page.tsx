"use client";

import React, { useEffect, useState } from "react";
import { Briefcase, Calendar, DollarSign, Tag, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Navbar from "@/components/ui/navbar";
import { useAccount } from "wagmi";
import axios from "axios";
import { publicClient, useEthersSigner, walletClient } from "@/lib/viemClient";
import { GigContractABI } from "@/lib/abis/GigContract";
import { BAS, SchemaEncoder } from "@bnb-attestation-service/bas-sdk";
import { gigAgreement, gigAgreementUID } from "@/lib/const";
import { bscTestnet } from "viem/chains";
import Submission from "@/components/pages/Submission";

const GigPage = ({ params }: { params: { uid: string } }) => {
  const [proposal, setProposal] = useState("");
  const [isClient, setIsClient] = useState(false);
  const [gig, setGig] = useState<any>(null);
  const { address } = useAccount();
  const BASContractAddress = "0x6c2270298b1e6046898a322acB3Cbad6F99f7CBD"; //bnb testnet
  const bas = new BAS(BASContractAddress);
  const signer = useEthersSigner({ chainId: bscTestnet.id });

  useEffect(() => {
    const fetchGig = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/gig/${params.uid}/applicants`
        );
        console.log(response.data[0]);
        setGig(response.data[0]);
      } catch (error) {
        console.error("Error fetching gig:", error);
      }
    };

    fetchGig();
  }, [params.uid]);

  useEffect(() => {
    if (gig && address) {
      setIsClient(address.toLowerCase() === gig.clientAddress.toLowerCase());
    }
  }, [address, gig]);

  const handleApplicationProposal = async () => {
    try {
      const txhash = await walletClient.writeContract({
        account: address!,
        address: gig.gigContractAddress,
        abi: GigContractABI,
        functionName: "applyForGig",
        args: [proposal],
      });
      console.log(txhash);
    } catch (error) {}
  };

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleApplicationProposal();
    const data = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/gig/${params.uid}`,
      { freelancerAddress: address, proposal: proposal }
    );
    console.log(data);
    setProposal("");
  };

  const handleApplicationAccept = async (applicantUID: string) => {
    try {
      const schemaEncoder = new SchemaEncoder(gigAgreement);
      const encodedData = schemaEncoder.encodeData([
        { name: "gigTitle", value: gig.gigName, type: "string" },
        { name: "refUID", value: gig.uid, type: "bytes32" },
        { name: "gigDescription", value: gig.gigDescription, type: "string" },
        { name: "gigDeadline", value: gig.deadline, type: "uint256" },
        { name: "gigBudget", value: gig.budget, type: "uint256" },
        { name: "gigClientUID", value: gig.clientUID, type: "bytes32" },
        { name: "gigApplicantUID", value: applicantUID, type: "bytes32" },
        {
          name: "gigContractAddress",
          value: gig.gigContractAddress,
          type: "address",
        },
      ]);
      const schemaUID = gigAgreementUID;
      bas.connect(signer!);
      const tx = await bas.attest({
        schema: schemaUID,
        data: {
          recipient: gig.gigContractAddress,
          expirationTime: BigInt(0),
          revocable: true, // Be aware that if your schema is not revocable, this MUST be false
          data: encodedData,
        },
      });
      const agreementUID = await tx.wait();
      console.log(agreementUID);

      //Write to contract
      const txhash = await walletClient.writeContract({
        account: address!,
        address: gig.gigContractAddress,
        abi: GigContractABI,
        functionName: "chooseFreelancer",
        args: [1, agreementUID],
      });
      console.log(txhash);

      // Store this in db to index
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/gig/${gig.uid}`,
        {
          AggrementUid: agreementUID,
          freelancerAddress: address,
          isAccepted: true,
          freelancerUID: applicantUID,
          IsCompleted: false,
        }
      );
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  if (!gig) {
    return (
      <div className="min-h-screen bg-[#FDF7F0] py-12 px-4">
        <Navbar />
        <div className="container mx-auto max-w-4xl">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDF7F0] py-12 px-4">
      <Navbar />
      <div className="container mx-auto max-w-4xl mt-4">
        <Card className="mb-8 border-2 border-[#1E3A8A] shadow-[0_6px_0_0_#1E3A8A] radius-2xl">
          <CardHeader>
            <CardTitle className="text-3xl font-black text-[#1E3A8A]">
              {gig.gigName}
            </CardTitle>
            <CardDescription className="text-[#FF5C00]">
              Posted on {new Date(gig.createdAt).toLocaleDateString()}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-[#1E3A8A]">{gig.gigDescription}</p>
            <div className="flex flex-wrap gap-2">
              {gig.tags.map((tag: any, index: number) => (
                <span
                  key={index}
                  className="bg-[#FFE1A1] text-[#1E3A8A] px-2 py-1 rounded-full text-sm flex items-center"
                >
                  <Tag size={14} className="mr-1" /> {tag}
                </span>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center">
                <DollarSign className="text-[#FF5C00] mr-2" />
                <span className="text-[#1E3A8A] font-bold">
                  Budget: ${gig.budget}
                </span>
              </div>
              <div className="flex items-center">
                <Calendar className="text-[#FF5C00] mr-2" />
                <span className="text-[#1E3A8A] font-bold">
                  Deadline: {new Date(gig.deadline).toLocaleDateString()}
                </span>
              </div>
            </div>
            <div className="flex items-center">
              <Briefcase className="text-[#FF5C00] mr-2" />
              <span className="text-[#1E3A8A] font-bold">
                Contract Address: {gig.gigContractAddress}
              </span>
            </div>
            <div className="flex items-center">
              <Users className="text-[#FF5C00] mr-2" />
              <span className="text-[#1E3A8A] font-bold">
                Applicants: {gig.applicants.length}
              </span>
            </div>
          </CardContent>
        </Card>

        {isClient && gig.isAccepted && (
          <Card className="mb-8 border-2 border-[#1E3A8A] shadow-[0_6px_0_0_#1E3A8A]">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-[#1E3A8A]">
                Apply for this Gig
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleApply}>
                <Textarea
                  placeholder="Write your proposal here..."
                  value={proposal}
                  onChange={(e) => setProposal(e.target.value)}
                  className="mb-4 border-2 border-[#1E3A8A] focus:ring-[#FF5C00] shadow-[0_4px_0_0_#1E3A8A] hover:shadow-[0_2px_0_0_#1E3A8A] hover:translate-y-[2px] transition-all text-[#1E3A8A]"
                />
                <Button
                  type="submit"
                  className="w-full bg-[#FF5C00] text-white border-2 border-[#1E3A8A] shadow-[0_4px_0_0_#1E3A8A] hover:shadow-[0_2px_0_0_#1E3A8A] hover:translate-y-[2px] transition-all hover:[&:not(:disabled)]:bg-[#1E3A8A]"
                >
                  Submit Proposal
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {isClient && (
          <Card className="mb-8 border-2 border-[#1E3A8A] shadow-[0_6px_0_0_#1E3A8A]">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-[#1E3A8A]">
                Applicants
              </CardTitle>
            </CardHeader>
            <CardContent>
              {gig.applicants.map((applicant: any, index: number) => (
                <div
                  key={index}
                  className="mb-4 p-4 bg-white rounded-lg border-2 border-[#1E3A8A] flex justify-between items-center"
                >
                  <div className="mb-4">
                    <div className="flex items-center mb-2">
                      <Avatar className="mr-2">
                        <AvatarImage
                          src={`https://avatar.vercel.sh/${applicant.freelancerAddress}`}
                        />
                        <AvatarFallback>FL</AvatarFallback>
                      </Avatar>
                      <span className="text-[#1E3A8A] font-bold">
                        {applicant.freelancerAddress.slice(0, 6)}...
                        {applicant.freelancerAddress.slice(-4)}
                      </span>
                    </div>
                    <p className="text-[#1E3A8A]">{applicant.proposal}</p>
                  </div>
                  <Button
                    className="px-6 py-2 bg-[#FF5C00] rounded-full font-bold text-white border-2 border-[#1E3A8A] shadow-[0_4px_0_0_#1E3A8A] hover:shadow-[0_2px_0_0_#1E3A8A] hover:translate-y-[2px] transition-all hover:[&:not(:disabled)]:bg-[#1E3A8A]"
                    onClick={() => {
                      handleApplicationAccept(applicant.freelancerDetails.uid);
                    }}
                  >
                    Accept
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
        <div>
          <Submission
            description={
              "Apply for gig feature , with a textbox and submit proposal button.The button should be in green color."
            }
            gigContarctAddress={gig.gigContractAddress}
            gigUID={gig.uid}
            freelancerUID={gig.freelancerUID}
          />
        </div>
      </div>
    </div>
  );
};

export default GigPage;
