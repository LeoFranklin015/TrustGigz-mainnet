"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/ui/navbar";
import { useAccount } from "wagmi";
import { checkFreelancerRegistered } from "@/lib/BASHelpers/checkFreelancerRegistered";
import FreelancerProfileSetupModal from "@/components/modals/freeLancerSetupModal";
import axios from "axios";

const GigCard: React.FC<{ gig: any }> = ({ gig }) => {
  return (
    <div className="bg-white p-6 rounded-xl border-2 border-[#1E3A8A] shadow-[0_6px_0_0_#1E3A8A] hover:shadow-[0_4px_0_0_#1E3A8A] hover:translate-y-[2px] transition-all">
      <h2 className="text-2xl font-bold text-[#1E3A8A] mb-2">{gig.gigName}</h2>
      <p className="text-[#FF5C00] mb-4">{gig.gigDescription}</p>
      <div className="flex flex-wrap gap-2 mb-4">
        {gig.tags.map((tag: any, index: number) => (
          <span
            key={index}
            className="bg-[#FFE1A1] text-[#1E3A8A] px-2 py-1 rounded-full text-sm"
          >
            {tag}
          </span>
        ))}
      </div>
      <p className="text-[#1E3A8A] mb-2">Budget: ${gig.budget}</p>
      <p className="text-[#1E3A8A] mb-4">
        Deadline: {new Date(gig.deadline).toLocaleDateString()}
      </p>
      <div className="flex justify-between items-center">
        <span
          className={`px-2 py-1 rounded-full text-sm ${
            gig.isAccepted
              ? "bg-green-200 text-green-800"
              : "bg-yellow-200 text-yellow-800"
          }`}
        >
          {gig.isAccepted ? "Accepted" : "Open"}
        </span>
        <Link
          href={`/gigs/${gig.uid}`}
          className="px-4 py-2 bg-[#FF5C00] rounded-full font-bold text-white border-2 border-[#1E3A8A] shadow-[0_4px_0_0_#1E3A8A] hover:shadow-[0_2px_0_0_#1E3A8A] hover:translate-y-[2px] transition-all"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default function GigsPage() {
  const { address } = useAccount();
  // This is mock data based on the structure you provided
  const [gigs, setGigs] = useState<any[]>([]);
  useEffect(() => {
    const fetchGigs = async () => {
      try {
        const data = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/gig`
        );
        console.log(data.data);
        setGigs(data.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchGigs();
  }, []);

  const [isOpen, setIsOpen] = useState(true);
  const [registeredFreelancer, setRegisteredFreelancer] = useState(false);

  useEffect(() => {
    const checkAlreadyRegistered = async () => {
      const check = await checkFreelancerRegistered(address!);
      setRegisteredFreelancer(check);
      console.log(check);
    };
    if (address) {
      checkAlreadyRegistered();
    }
  }, [address]);

  useEffect(() => {
    if (registeredFreelancer) {
      setIsOpen(false);
    }
  }, [registeredFreelancer]);

  return (
    <div className="min-h-screen bg-[#FDF7F0] py-12 px-4">
      <Navbar />
      {address && !registeredFreelancer && (
        <FreelancerProfileSetupModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
        />
      )}
      <div className="container mx-auto">
        <h1 className="text-4xl font-black text-[#1E3A8A] mb-8 text-center mt-4">
          Available Gigs
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {gigs.map((gig) => (
            <GigCard key={gig._id} gig={gig} />
          ))}
        </div>
      </div>
    </div>
  );
}
