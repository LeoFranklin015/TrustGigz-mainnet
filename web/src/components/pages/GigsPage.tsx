"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/ui/navbar";
import { useAccount } from "wagmi";
// import { checkFreelancerRegistered } from "@/lib/BASHelpers/checkFreelancerRegistered";
import FreelancerProfileSetupModal from "@/components/modals/freelancerSetupModal";
import axios from "axios";
import { GigCard } from "@/components/ui/GigCard";

const checkFreelancerRegistered = async (freelancerAddress: string) => {
  try {
    const data = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/freelancer/${freelancerAddress}`
    );
    console.log(data.data);
    if (data.data) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return false;
    }
    throw error;
  }
};

export default function GigsPage() {
  const { address } = useAccount();
  // This is mock data based on the structure you provided
  const [gigs, setGigs] = useState<any[]>([]);
  const [isBrowser, setIsBrowser] = useState(false);
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
      if (!address) {
        return;
      }
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

  useEffect(() => {
    // Check if the code is running in the browser (client-side)
    if (typeof window !== "undefined") {
      setIsBrowser(true);
    }
  }, []);

  if (!isBrowser) {
    return null;
  }

  return (
    isBrowser && (
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
    )
  );
}
