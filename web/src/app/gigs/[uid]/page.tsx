"use client";

import React, { useEffect, useState } from "react";
import {
  Briefcase,
  Calendar,
  DollarSign,
  Tag,
  Users,
  FileText,
} from "lucide-react";
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

const GigPage = ({ params }: { params: { uid: string } }) => {
  const [proposal, setProposal] = useState("");
  const [isClient, setIsClient] = useState(false);
  const [gig, setGig] = useState<any>(null);
  const { address } = useAccount();

  useEffect(() => {
    const fetchGig = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/gig/${params.uid}`
        );
        setGig(response.data);
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

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    // Add your application logic here
    setProposal("");
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

        {!isClient && !gig.isAccepted && (
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
                  className="mb-4 border-2 border-[#1E3A8A] focus:ring-[#FF5C00]"
                />
                <Button
                  type="submit"
                  className="w-full bg-[#FF5C00] text-white border-2 border-[#1E3A8A] shadow-[0_4px_0_0_#1E3A8A] hover:shadow-[0_2px_0_0_#1E3A8A] hover:translate-y-[2px] transition-all"
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
                  className="mb-4 p-4 bg-white rounded-lg border-2 border-[#1E3A8A]"
                >
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
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default GigPage;
