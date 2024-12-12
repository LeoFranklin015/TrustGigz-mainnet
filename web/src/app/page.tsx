import Image from "next/image";
import Link from "next/link";
import { Briefcase, Users, FileCheck, Scale } from "lucide-react";

import Navbar from "@/components/ui/navbar";

export default function Homepage() {
  return (
    <div className="min-h-screen bg-[#FDF7F0] flex flex-col">
      {/* Navigation */}
      <Navbar />
      {/* Hero Section */}
      <main className="flex-grow w-full px-0 py-8 md:py-16 flex flex-col lg:flex-row items-center justify-center">
        <div className="w-full mx-auto px-4 lg:w-1/2 space-y-8 max-w-2xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-black leading-tight">
            Trust-Powered Freelance Marketplace
          </h1>
          <p className="text-xl md:text-2xl text-[#FF5C00] font-medium">
            Bridging the gap between clients and freelancers with
            blockchain-backed trust
          </p>
          <div className="space-y-6">
            <p className="text-lg md:text-xl text-black">
              Choose your role to get started:
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link
                href="/post-gig"
                className="w-full sm:w-auto px-8 py-3 bg-[#FF5C00] rounded-full font-bold text-white border-2 border-[#1E3A8A] shadow-[0_4px_0_0_#1E3A8A] hover:shadow-[0_2px_0_0_#1E3A8A] hover:translate-y-[2px] transition-all"
              >
                Post a Gig
              </Link>
              <Link
                href="/gigs"
                className="w-full sm:w-auto px-8 py-3 bg-[#FFE1A1] rounded-full font-bold text-black border-2 border-[#1E3A8A] shadow-[0_4px_0_0_#1E3A8A] hover:shadow-[0_2px_0_0_#1E3A8A] hover:translate-y-[2px] transition-all"
              >
                Find a Gig
              </Link>
            </div>
          </div>
        </div>
        <div className="lg:w-1/2 mt-8 lg:mt-0 flex justify-center items-center">
          <Image
            src="/placeholder.svg?height=600&width=600"
            alt="Trust-Powered Freelance Marketplace Illustration"
            width={600}
            height={600}
            className="w-full max-w-lg h-auto"
          />
        </div>
      </main>
      <section id="how-it-works" className="bg-[#FFE1A1] py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-black text-center mb-12 text-[#1E3A8A]">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Briefcase,
                title: "1. Post the Job",
                description:
                  "Clients list their job requirements on the platform",
              },
              {
                icon: Users,
                title: "2. Connect with Freelancers",
                description: "Sign an agreement via Attestation",
              },
              {
                icon: FileCheck,
                title: "3. Work Submission",
                description:
                  "WorkSubmitted Attestation is made. AI evaluates the demo and scores based on relevance.",
              },
              {
                icon: Scale,
                title: "4. Dispute Resolution",
                description:
                  "Validators analyze and review. AI score and validators' score resolve disputes.",
              },
            ].map((step, index) => (
              <div
                key={index}
                className="bg-[#FDF7F0] p-6 rounded-xl border-2 border-[#1E3A8A] shadow-[0_6px_0_0_#1E3A8A]"
              >
                <div className="w-16 h-16 rounded-full bg-[#FF5C00] flex items-center justify-center mb-4">
                  <step.icon size={32} className="text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-[#1E3A8A]">
                  {step.title}
                </h3>
                <p className="text-[#1E3A8A]">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#FDF7F0] py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-black text-center mb-12 text-[#1E3A8A]">
            Built Using
          </h2>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
            {["BAS.png", "ZKPass.png", "SpaceId.png"].map((logo, index) => (
              <div
                key={index}
                className="w-32 h-32 rounded-full overflow-hidden border-4 border-[#1E3A8A] shadow-[0_6px_0_0_#1E3A8A] transition-transform hover:scale-105"
              >
                <Image
                  src={`/logos/${logo}`}
                  alt={`Technology Logo ${index}`}
                  width={128}
                  height={128}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
