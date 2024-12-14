"use client";

import React, { useState, KeyboardEvent } from "react";
import { X } from "lucide-react";
import axios from "axios";
import { BAS, SchemaEncoder } from "@bnb-attestation-service/bas-sdk";
import { useEthersSigner } from "@/lib/viemClient";
import { bsc } from "viem/chains";
import { useAccount } from "wagmi";
import { clientSchemaUID } from "@/lib/const";
import { StepperModal, StepStatus, updateStepStatus } from "./Stepper";

interface ProfileSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ClientProfileSetupModal: React.FC<ProfileSetupModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const BASContractAddress = "0x247Fe62d887bc9410c3848DF2f322e52DA9a51bC"; // bnb mainnet
  const bas = new BAS(BASContractAddress);
  const signer = useEthersSigner({ chainId: bsc.id });
  const { address } = useAccount();
  const [postClientSteps, setPostClientSteps] = useState([
    { label: "Attestation", status: "idle" as StepStatus },
    { label: "Indexing", status: "idle" as StepStatus },
  ]);
  const [postClientStepper, setPostClientStepper] = useState(false);

  const handleAddCategory = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && category.trim()) {
      e.preventDefault();
      setCategories([...categories, category.trim()]);
      setCategory("");
    }
  };

  const handleRemoveCategory = (categoryToRemove: string) => {
    setCategories(categories.filter((cat) => cat !== categoryToRemove));
  };

  if (!isOpen) return null;

  const createClient = async () => {
    setPostClientStepper(true);
    updateStepStatus(setPostClientSteps, 0, "loading");
    const schemaEncoder = new SchemaEncoder(
      "string clientName,address clientAddress,string clientBio,string[] category,uint256 reputationScore,uint256 noOfJobsPosted,uint256 noOfDisputesRaised,uint256 noOfDisputesWon"
    );

    const encodedData = schemaEncoder.encodeData([
      { name: "clientName", value: name, type: "string" },
      {
        name: "clientAddress",
        value: address!,
        type: "address",
      },
      { name: "clientBio", value: bio, type: "string" },
      { name: "category", value: categories, type: "string[]" },
      { name: "reputationScore", value: BigInt(0), type: "uint256" }, // 1, type: "uint256" },
      { name: "noOfJobsPosted", value: BigInt(0), type: "uint256" },
      { name: "noOfDisputesRaised", value: BigInt(0), type: "uint256" },
      { name: "noOfDisputesWon", value: BigInt(0), type: "uint256" },
    ]);
    const schemaUID = clientSchemaUID;
    bas.connect(signer!);
    const tx = await bas.attest({
      schema: schemaUID,
      data: {
        recipient: address!,
        expirationTime: BigInt(0),
        revocable: true, // Be aware that if your schema is not revocable, this MUST be false
        data: encodedData,
      },
    });

    const newAttestationUID = await tx.wait();
    updateStepStatus(setPostClientSteps, 0, "complete");

    try {
      updateStepStatus(setPostClientSteps, 1, "loading");
      const dataStoredinDb = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/client`,
        {
          uid: newAttestationUID,
          clientName: name,
          clientAddress: address!,
          clientBio: bio,
          category: categories,
        }
      );

      console.log(dataStoredinDb);

      updateStepStatus(setPostClientSteps, 1, "complete");
    } catch (error) {
      const currentStep = postClientSteps.findIndex(
        (step) => step.status === "loading"
      );
      if (currentStep !== -1) {
        updateStepStatus(setPostClientSteps, currentStep, "error");
      }
      console.log(error);
    }

    // onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-[#FDF7F0] rounded-xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <StepperModal
          isOpen={postClientStepper}
          steps={postClientSteps}
          title="Creating Client Profile"
        />
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-black text-[#1E3A8A]">
            Set Up Your Profile
          </h2>
          <button
            onClick={onClose}
            className="text-[#1E3A8A] hover:text-[#FF5C00]"
          >
            <X size={24} />
          </button>
        </div>
        <form className="space-y-6">
          <div>
            <label
              htmlFor="name"
              className="block text-lg font-medium text-[#1E3A8A] mb-2"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 rounded-full border-2 border-[#1E3A8A] focus:outline-none focus:ring-2 focus:ring-[#FF5C00] bg-white text-[#1E3A8A]"
              placeholder="Enter your name"
            />
          </div>
          <div>
            <label
              htmlFor="bio"
              className="block text-lg font-medium text-[#1E3A8A] mb-2"
            >
              Bio
            </label>
            <textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border-2 border-[#1E3A8A] focus:outline-none focus:ring-2 focus:ring-[#FF5C00] bg-white text-[#1E3A8A] h-32 resize-none"
              placeholder="Tell us about yourself"
            />
          </div>
          <div>
            <label
              htmlFor="category"
              className="block text-lg font-medium text-[#1E3A8A] mb-2"
            >
              Categories
            </label>
            <input
              type="text"
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              onKeyDown={handleAddCategory}
              className="w-full px-4 py-2 rounded-full border-2 border-[#1E3A8A] focus:outline-none focus:ring-2 focus:ring-[#FF5C00] bg-white text-[#1E3A8A]"
              placeholder="Add a category and press Enter"
            />
            <div className="mt-2 flex flex-wrap gap-2">
              {categories.map((cat, index) => (
                <div
                  key={index}
                  className="bg-[#FFE1A1] text-[#1E3A8A] px-3 py-1 rounded-full flex items-center"
                >
                  <span>{cat}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveCategory(cat)}
                    className="ml-2 focus:outline-none"
                  >
                    <X size={16} className="text-[#1E3A8A]" />
                  </button>
                </div>
              ))}
            </div>
          </div>
          <button
            className="px-6 py-2 bg-[#FF5C00] rounded-full font-bold text-white border-2 border-[#1E3A8A] shadow-[0_4px_0_0_#1E3A8A] hover:shadow-[0_2px_0_0_#1E3A8A] hover:translate-y-[2px] transition-all"
            onClick={async (e) => {
              e.preventDefault();
              await createClient();
              onClose();
            }}
          >
            Save Profile
          </button>
        </form>
      </div>
    </div>
  );
};

export default ClientProfileSetupModal;
