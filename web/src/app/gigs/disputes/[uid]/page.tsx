"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Briefcase, Calendar, DollarSign, Tag, Users } from "lucide-react";
import Navbar from "@/components/ui/navbar";
import { RotatingSlider } from "@/components/ui/RotatingSlider";
import axios from "axios";
import TransgateConnect from "@zkpass/transgate-js-sdk";
import { verifyEVMMessageSignature } from "@/lib/verifyZKPass";

// Mock gig data (replace with actual data fetching in a real application)
// Mock dispute data
const mockDisputes = [
  {
    percentage: 60,
    description: "The color scheme doesn't match the requirements.",
  },
  {
    percentage: 80,
    description: "Some features are missing from the final product.",
  },
  {
    percentage: 30,
    description: "The layout is not responsive on mobile devices.",
  },
];

const DisputeResolutionPage = ({ params }: { params: { uid: string } }) => {
  const [clientFavor, setClientFavor] = useState(50);
  const [decision, setDecision] = useState("");
  const [gig, setGig] = useState<any>(null);
  const [verified, setVerified] = useState<Boolean | null>(null);

  const handleSubmitDecision = () => {
    console.log("Decision submitted:", { clientFavor, decision });
    // Here you would typically send this data to your backend
  };

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

  const verify = async () => {
    try {
      // The appid of the project created in dev center
      const appid = "5c791946-486c-4939-b8fa-ed022dfd4c4a";

      // Create the connector instance
      const connector = new TransgateConnect(appid);

      // Check if the TransGate extension is installed
      // If it returns false, please prompt to install it from chrome web store
      const isAvailable = await connector.isTransgateAvailable();

      if (isAvailable) {
        // The schema id of the project
        const schemaId = "9f5dd9b3f5e84a86b2515c70b4dc650a";

        // Launch the process of verification
        // This method can be invoked in a loop when dealing with multiple schemas
        const res: any = await connector.launch(schemaId);

        console.log(res);

        const verifyRes = verifyEVMMessageSignature(
          res.taskId,
          schemaId,
          res.uHash,
          res.publicFieldsHash,
          res.validatorSignature,
          res.validatorAddress
        );

        console.log(verifyRes);
        setVerified(verifyRes);
        // verifiy the res onchain/offchain based on the requirement
      } else {
        console.log("Please install TransGate");
      }
    } catch (error) {
      console.log("transgate error", error);
    }
  };

  if (!gig) {
    return (
      <div className="min-h-screen bg-[#FDF7F0]">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-black text-[#1E3A8A] mb-8">
            Loading...
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDF7F0]">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-black text-[#1E3A8A] mb-8">
          Dispute Resolution
        </h1>

        {/* Gig Details Card */}
        <Card className="mb-4 border-2 border-[#1E3A8A] shadow-[0_6px_0_0_#1E3A8A] overflow-hidden">
          <CardHeader className="bg-[#FFE1A1] border-b-2 border-[#1E3A8A]">
            <CardTitle className="text-3xl font-black text-[#1E3A8A]">
              {gig.gigName}
            </CardTitle>
            <CardDescription className="text-[#FF5C00] font-semibold">
              Posted on {new Date(gig.createdAt.$date).toLocaleDateString()}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 p-6">
            <p className="text-[#1E3A8A] text-lg">{gig.gigDescription}</p>
            <div className="flex flex-wrap gap-2">
              {gig.tags.map((tag: any, index: number) => (
                <span
                  key={index}
                  className="bg-[#FFE1A1] text-[#1E3A8A] px-3 py-1 rounded-full text-sm flex items-center font-medium"
                >
                  <Tag size={14} className="mr-2" /> {tag}
                </span>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div className="flex items-center bg-[#FDF7F0] p-3 rounded-lg">
                <DollarSign className="text-[#FF5C00] mr-3" size={24} />
                <span className="text-[#1E3A8A] font-bold text-lg">
                  Budget: ${gig.budget}
                </span>
              </div>
              <div className="flex items-center bg-[#FDF7F0] p-3 rounded-lg">
                <Calendar className="text-[#FF5C00] mr-3" size={24} />
                <span className="text-[#1E3A8A] font-bold text-lg">
                  Deadline: {new Date(gig.deadline).toLocaleDateString()}
                </span>
              </div>
            </div>
            <div className="flex items-center bg-[#FDF7F0] p-3 rounded-lg">
              <Briefcase className="text-[#FF5C00] mr-3" size={24} />
              <span className="text-[#1E3A8A] font-bold text-lg">
                Contract: {gig.gigContractAddress.slice(0, 6)}...
                {gig.gigContractAddress.slice(-4)}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Dispute Resolution Form */}
        <Card className="mb-8 border-2 border-[#1E3A8A] shadow-[0_6px_0_0_#1E3A8A] overflow-hidden">
          <CardHeader className="bg-[#FFE1A1] border-b-2 border-[#1E3A8A]">
            <CardTitle className="text-2xl font-bold text-[#1E3A8A]">
              Resolve Dispute
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 p-6">
            <div className="flex w-full justify-between items-center gap-2">
              <div className="flex flex-col items-center">
                <h3 className="text-lg font-semibold text-[#1E3A8A] mb-4">
                  Client Favor
                </h3>
                <RotatingSlider value={clientFavor} onChange={setClientFavor} />
                <p className="mt-2 text-[#1E3A8A] font-bold">{clientFavor}%</p>
              </div>
              <div className="flex flex-col items-center w-full">
                <Textarea
                  placeholder="Enter your decision here..."
                  value={decision}
                  onChange={(e) => setDecision(e.target.value)}
                  className="min-h-[150px] border-2 border-[#1E3A8A] focus:ring-[#FF5C00] text-black placeholder:text-black"
                />
              </div>
            </div>
            <div className="text-[#1E3A8A] text-sm">
              The validator must need to verify that he has done freelancing in
              Fiverr to showcase his expertise( for demo considering 0 works)
            </div>
            <div className="flex items-center gap-4">
              <Button
                disabled={
                  verified === null ? false : verified === true ? true : false
                }
                onClick={verify}
                className={`w-full bg-[#FF5C00] text-white border-2 border-[#1E3A8A] shadow-[0_4px_0_0_#1E3A8A] hover:shadow-[0_2px_0_0_#1E3A8A] hover:translate-y-[2px] transition-all hover:bg-[#1E3A8A]${
                  verified === true
                    ? " opacity-50 cursor-not-allowed bg-green-500 "
                    : verified === false
                    ? " opacity-50 cursor-not-allowed bg-red-500"
                    : ""
                }`}
              >
                {verified === null
                  ? "Verify"
                  : verified === true
                  ? "Verified ✅"
                  : "Not Verified ❌"}
              </Button>
              <Button
                disabled={
                  verified === null ? true : verified === true ? false : true
                }
                onClick={verify}
                className="w-full bg-[#FF5C00] text-white border-2 border-[#1E3A8A] shadow-[0_4px_0_0_#1E3A8A] hover:shadow-[0_2px_0_0_#1E3A8A] hover:translate-y-[2px] transition-all hover:bg-[#1E3A8A]"
              >
                Submit Decision
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Mock Disputes */}
        <Card className="mb-8 border-2 border-[#1E3A8A] shadow-[0_6px_0_0_#1E3A8A] overflow-hidden">
          <CardHeader className="bg-[#FFE1A1] border-b-2 border-[#1E3A8A]">
            <CardTitle className="text-2xl font-bold text-[#1E3A8A]">
              Recent Disputes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 p-6">
            {mockDisputes.map((dispute, index) => (
              <div
                key={index}
                className="bg-[#FDF7F0] p-4 rounded-lg border-2 border-[#1E3A8A]"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[#1E3A8A] font-bold">
                    Client Favor:
                  </span>
                  <span className="text-[#FF5C00] font-bold">
                    {dispute.percentage}%
                  </span>
                </div>
                <p className="text-[#1E3A8A]">{dispute.description}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DisputeResolutionPage;
