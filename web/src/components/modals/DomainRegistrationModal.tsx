import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { SIDRegister } from "@web3-name-sdk/register";
import { providers } from "ethers";

interface DomainRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DomainRegistrationModal: React.FC<
  DomainRegistrationModalProps
> = ({ isOpen, onClose }) => {
  const [domain, setDomain] = useState("");
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [price, setPrice] = useState<number | null>(null);

  const checkAvailability = async (domainName: string) => {
    if (window.ethereum) {
      try {
        const provider = new providers.Web3Provider(window.ethereum);

        // Switch to BSC
        await provider.send("wallet_switchEthereumChain", [
          { chainId: "0x38" },
        ]);

        // Connect wallet
        await provider.send("eth_requestAccounts", []);

        // Get signer
        const signer = provider.getSigner();

        // Initialize SID Register
        const register = new SIDRegister({
          signer: signer,
          chainId: 56, // BSC Mainnet
        });

        // Check domain availability
        const available = await register.getAvailable(domainName);
        const price = await register.getRentPrice(domainName, 1);

        // Convert price to BNB
        const priceInBNB = Number(price) / Math.pow(10, 18);

        setIsAvailable(available);
        setPrice(priceInBNB);

        console.log("Domain availability:", available);
        console.log("Domain price:", priceInBNB);
      } catch (error) {
        console.error("Error checking domain:", error);
        setIsAvailable(null);
        setPrice(null);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    checkAvailability(domain);
  };

  const handleRegister = async (e: React.FormEvent) => {
    if (window.ethereum) {
      try {
        const provider = new providers.Web3Provider(window.ethereum);

        // Switch to BSC
        await provider.send("wallet_switchEthereumChain", [
          { chainId: "0x38" },
        ]);

        // Connect wallet
        await provider.send("eth_requestAccounts", []);

        // Get signer
        const signer = provider.getSigner();

        // Get address
        const address = await signer.getAddress();

        // Initialize SID Register
        const register = new SIDRegister({
          signer: signer,
          chainId: 56, // BSC Mainnet
        });

        // Register domain
        console.log(domain, address, register);
        // await register.register(domain, address, 1, {
        //   setPrimaryName: true,
        // });
        await register.register(domain, address, 1, {
          setPrimaryName: true, // set as primary name, default is false,
          referrer: "test.bnb", // referrer domain, default is null
        });

        console.log(`Registering domain: ${domain}`);
        onClose();
      } catch (error) {
        console.error("Error registering domain:", error);
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-[#FDF7F0] border-2 border-[#1E3A8A]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-[#1E3A8A]">
            Register Your Domain
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="domain" className="text-[#1E3A8A]">
              Enter your desired domain name
            </Label>
            <Input
              id="domain"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="yourdomain.bnb"
              className="text-black border-2 border-[#1E3A8A] focus:ring-[#FF5C00]"
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-[#FF5C00] text-white border-2 border-[#1E3A8A] shadow-[0_4px_0_0_#1E3A8A] hover:shadow-[0_2px_0_0_#1E3A8A] hover:translate-y-[2px] transition-all hover:bg-[#1E3A8A]"
          >
            Check Availability
          </Button>
        </form>
        {isAvailable !== null && (
          <div className="mt-4">
            <p
              className={`font-bold ${
                isAvailable ? "text-green-600" : "text-red-600"
              }`}
            >
              {isAvailable ? "Available" : "Not Available"}
            </p>
            {isAvailable && price && (
              <p className="text-[#1E3A8A]">Price: {price.toFixed(4)} BNB</p>
            )}
          </div>
        )}
        {isAvailable && (
          <Button
            onClick={handleRegister}
            className="w-full mt-4 bg-[#FF5C00] text-white border-2 border-[#1E3A8A] shadow-[0_4px_0_0_#1E3A8A] hover:shadow-[0_2px_0_0_#1E3A8A] hover:translate-y-[2px] transition-all hover:bg-[#1E3A8A]"
          >
            Register Domain
          </Button>
        )}
      </DialogContent>
    </Dialog>
  );
};
