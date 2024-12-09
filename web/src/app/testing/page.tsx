import Home from "@/components/pages/Homepage";
import Image from "next/image";
import Link from "next/link";

export default function Homepage() {
  return (
    <div className="min-h-screen bg-[#FDF7F0] flex flex-col">
      {/* Navigation */}
      <nav className="border-b border-black bg-[#FDF7F0] p-4 w-full mx-auto">
        <div className="w-full  mx-auto flex items-center justify-between px-8">
          <div className="flex items-center space-x-2">
            <div className="text-3xl font-black text-black">TrustGigz</div>
          </div>
          <div className="hidden lg:flex items-center space-x-6 text-black">
            <Link
              href="#"
              className="hover:text-[#FF5C00] transition-colors font-medium"
            >
              How it works?
            </Link>
            <Link
              href="#"
              className="hover:text-[#FF5C00] transition-colors font-medium"
            >
              Become a freelancer
            </Link>
            <Link
              href="#"
              className="hover:text-[#FF5C00] transition-colors font-medium"
            >
              Search for freelancers
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <button className="px-6 py-2 bg-[#FFE1A1] rounded-full font-bold text-black border-2 border-[#1E3A8A] shadow-[0_4px_0_0_#1E3A8A] hover:shadow-[0_2px_0_0_#1E3A8A] hover:translate-y-[2px] transition-all">
              Login
            </button>
            <button className="px-6 py-2 bg-[#FF5C00] rounded-full font-bold text-white border-2 border-[#1E3A8A] shadow-[0_4px_0_0_#1E3A8A] hover:shadow-[0_2px_0_0_#1E3A8A] hover:translate-y-[2px] transition-all">
              Get Started
            </button>
          </div>
        </div>
      </nav>

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
              <button className="w-full sm:w-auto px-8 py-3 bg-[#FF5C00] rounded-full font-bold text-white border-2 border-[#1E3A8A] shadow-[0_4px_0_0_#1E3A8A] hover:shadow-[0_2px_0_0_#1E3A8A] hover:translate-y-[2px] transition-all">
                I am a Client
              </button>
              <button className="w-full sm:w-auto px-8 py-3 bg-[#FFE1A1] rounded-full font-bold text-black border-2 border-[#1E3A8A] shadow-[0_4px_0_0_#1E3A8A] hover:shadow-[0_2px_0_0_#1E3A8A] hover:translate-y-[2px] transition-all">
                I am a Freelancer
              </button>
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
    </div>
  );
}
