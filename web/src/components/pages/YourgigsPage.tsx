"use client";

import React, { useEffect, useState } from "react";
import Navbar from "@/components/ui/navbar";
import { useAccount } from "wagmi";

import axios from "axios";
import { GigCard } from "@/components/ui/GigCard";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { DomainRegistrationModal } from "../modals/DomainRegistrationModal";

export default function GigsPage() {
  const { address } = useAccount();

  const [postedGigs, setPostedGigs] = useState<any[]>([]);
  const [acceptedGigs, setAcceptedGigs] = useState<any[]>([]);
  const [isBrowser, setIsBrowser] = useState(false);
  useEffect(() => {
    const fetchGigs = async () => {
      try {
        const data = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/gig`
        );
        console.log(data.data);

        // Filter gigs in one pass
        const postedGigs: any = [];
        const AcceptedGigs: any = [];

        data.data.forEach((gig: any) => {
          if (gig.clientAddress == address?.toLowerCase()) {
            postedGigs.push(gig);
          }
          if (
            gig.isAccepted == true &&
            gig.freelancerAddress == address?.toLowerCase()
          ) {
            AcceptedGigs.push(gig);
          }
        });

        // Update states with the filtered arrays
        setPostedGigs(postedGigs);
        setAcceptedGigs(AcceptedGigs);
      } catch (error) {
        console.log(error);
      }
    };
    fetchGigs();
  }, [address]);

  const [isOpen, setIsOpen] = useState(true);
  const [registeredFreelancer, setRegisteredFreelancer] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
        <DomainRegistrationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
        <Card className="mb-8 border-2 border-[#1E3A8A] shadow-[0_6px_0_0_#1E3A8A] bg-[#FFE1A1]">
          <CardContent className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-[#1E3A8A] font-medium text-center sm:text-left">
              People can recognize you and your work easily with your domain
              name. Register now to get your domain.
            </p>
            <Button
              onClick={() => setIsModalOpen(true)}
              className="bg-[#FF5C00] text-white border-2 border-[#1E3A8A] shadow-[0_4px_0_0_#1E3A8A] hover:shadow-[0_2px_0_0_#1E3A8A] hover:translate-y-[2px] transition-all"
            >
              Register
            </Button>
          </CardContent>
        </Card>
        <div className="container mx-auto flex flex-col gap-2">
          <div>
            <h1 className="text-4xl font-black text-[#1E3A8A] mb-8 text-center mt-4">
              Posted Gigs
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {postedGigs.length == 0 && (
                <p className="text-2xl font-bold text-[#1E3A8A] mb-2 text-center mt-4">
                  You have no posted gigs
                </p>
              )}
              {postedGigs.map((gig) => (
                <GigCard key={gig._id} gig={gig} />
              ))}
            </div>
          </div>
          <div>
            <h1 className="text-4xl font-black text-[#1E3A8A] mb-8 text-center mt-4">
              Accepted Gigs
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {acceptedGigs.length == 0 && (
                <p className="text-2xl font-bold text-[#1E3A8A] mb-2 text-center mt-4">
                  No open gigs
                </p>
              )}
              {acceptedGigs.map((gig) => (
                <GigCard key={gig._id} gig={gig} />
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  );
}
