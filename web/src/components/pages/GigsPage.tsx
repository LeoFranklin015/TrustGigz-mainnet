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
  const [openGigs, setOpenGigs] = useState<any[]>([]);
  const [yourGigs, setYourGigs] = useState<any[]>([]);
  const [disputedGigs, setDisputedGigs] = useState<any[]>([]);
  const [completedGigs, setCompletedGigs] = useState<any[]>([]);
  const [isBrowser, setIsBrowser] = useState(false);
  useEffect(() => {
    const fetchGigs = async () => {
      try {
        const data = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/gig`
        );
        console.log(data.data);

        // Filter gigs in one pass
        const openGigs: any = [];
        const yourGigs: any = [];
        const disputedGigs: any = [];
        const completedGigs: any = [];

        data.data.forEach((gig: any) => {
          if (gig.isAccepted == false) {
            openGigs.push(gig);
          }
          if (
            gig.isAccepted == true &&
            gig.freelancerAddress == address?.toLowerCase() &&
            gig.IsCompleted == false &&
            (gig.isDisputed == false || gig.isDisputed == null)
          ) {
            yourGigs.push(gig);
          }
          if (gig.isDisputed == true && gig.IsCompleted == false) {
            disputedGigs.push(gig);
          }
          if (gig.IsCompleted) {
            completedGigs.push(gig);
          }
        });

        // Update states with the filtered arrays
        setOpenGigs(openGigs);
        setYourGigs(yourGigs);
        setDisputedGigs(disputedGigs);
        setCompletedGigs(completedGigs);
      } catch (error) {
        console.log(error);
      }
    };
    fetchGigs();
  }, [address]);

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
        <div className="container mx-auto flex flex-col gap-2">
          <div>
            <h1 className="text-4xl font-black text-[#1E3A8A] mb-8 text-center mt-4">
              Your Gigs
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {yourGigs.length == 0 && (
                <p className="text-2xl font-bold text-[#1E3A8A] mb-2 text-center mt-4">
                  You have no gigs
                </p>
              )}
              {yourGigs.map((gig) => (
                <GigCard key={gig._id} gig={gig} />
              ))}
            </div>
          </div>
          <div>
            <h1 className="text-4xl font-black text-[#1E3A8A] mb-8 text-center mt-4">
              Open Gigs
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {openGigs.length == 0 && (
                <p className="text-2xl font-bold text-[#1E3A8A] mb-2 text-center mt-4">
                  No open gigs
                </p>
              )}
              {openGigs.map((gig) => (
                <GigCard key={gig._id} gig={gig} />
              ))}
            </div>
          </div>
          <div>
            <h1 className="text-4xl font-black text-[#1E3A8A] mb-8 text-center mt-4">
              Disputed
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {disputedGigs.length == 0 && (
                <p className="text-2xl font-bold text-[#1E3A8A] mb-2 text-center mt-4">
                  No disputed gigs
                </p>
              )}
              {disputedGigs.map((gig) => (
                <GigCard key={gig._id} gig={gig} />
              ))}
            </div>
          </div>
          <div>
            <h1 className="text-4xl font-black text-[#1E3A8A] mb-8 text-center mt-4">
              Completed
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {completedGigs.length == 0 && (
                <p className="text-2xl font-bold text-[#1E3A8A] mb-2 text-center mt-4">
                  No completed gigs
                </p>
              )}
              {completedGigs.map((gig) => (
                <GigCard key={gig._id} gig={gig} />
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  );
}
