"use client";

import React, { useState, KeyboardEvent } from "react";
import { X } from "lucide-react";
import axios from "axios";
import { BAS, SchemaEncoder } from "@bnb-attestation-service/bas-sdk";
import { useEthersSigner } from "@/lib/viemClient";
import { bscTestnet } from "viem/chains";
import { useAccount } from "wagmi";
import { freelancerSchemaUID, freelancerSchema } from "@/lib/const";
import { StepperModal, StepStatus, updateStepStatus } from "./Stepper";

interface ProfileSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FreelancerProfileSetupModal: React.FC<ProfileSetupModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [skill, setSkill] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const BASContractAddress = "0x6c2270298b1e6046898a322acB3Cbad6F99f7CBD"; //bnb testnet
  const bas = new BAS(BASContractAddress);
  const signer = useEthersSigner({ chainId: bscTestnet.id });
  const { address } = useAccount();

  const [freelancerSteps, setFreelancerSteps] = useState([
    { label: "Creating Attestation", status: "idle" as StepStatus },
    { label: "Indexing", status: "idle" as StepStatus },
  ]);
  const [freelancerStepper, setFreelancerStepper] = useState(false);
  const handleAddSkill = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && skill.trim()) {
      e.preventDefault();
      setSkills([...skills, skill.trim()]);
      setSkill("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove));
  };

  if (!isOpen) return null;

  const createFreelancer = async () => {
    setFreelancerStepper(true);
    updateStepStatus(setFreelancerSteps, 0, "loading");
    const schemaEncoder = new SchemaEncoder(freelancerSchema);

    const encodedData = schemaEncoder.encodeData([
      { name: "freelancerName", value: name, type: "string" },
      {
        name: "freelancerAddress",
        value: address!,
        type: "address",
      },
      { name: "freelancerBio", value: bio, type: "string" },
      { name: "skills", value: skills, type: "string[]" },
      { name: "reputationScore", value: BigInt(0), type: "uint256" },
      { name: "noOfGigsCompleted", value: BigInt(0), type: "uint256" },
      { name: "noOfDisputesArised", value: BigInt(0), type: "uint256" },
      { name: "noOfDisputesWon", value: BigInt(0), type: "uint256" },
    ]);

    const schemaUID = freelancerSchemaUID;
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
    updateStepStatus(setFreelancerSteps, 0, "complete");
    try {
      updateStepStatus(setFreelancerSteps, 1, "loading");
      const dataStoredinDb = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/freelancer`,
        {
          uid: newAttestationUID,
          freelancerName: name,
          freelancerAddress: address!,
          freelancerBio: bio,
          skills: skills,
        }
      );

      console.log(dataStoredinDb);
      updateStepStatus(setFreelancerSteps, 1, "complete");
    } catch (error) {
      const currentStep = freelancerSteps.findIndex(
        (step) => step.status === "loading"
      );
      if (currentStep !== -1) {
        updateStepStatus(setFreelancerSteps, currentStep, "error");
      }
      console.log(error);
    }

    // onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-[#FDF7F0] rounded-xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <StepperModal
          isOpen={freelancerStepper}
          steps={freelancerSteps}
          title="Creating Freelancer Profile"
        />
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-black text-[#1E3A8A]">
            Create Freelancer Profile
          </h2>
          <button
            onClick={onClose}
            className="text-[#1E3A8A] hover:text-[#FF5C00]"
          >
            <X size={24} />
          </button>
        </div>
        <div className="text-lg font-medium text-[#1E3A8A] mb-4">
          To apply for gigs , you need to create a freelancer profile
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
              value={skill}
              onChange={(e) => setSkill(e.target.value)}
              onKeyDown={handleAddSkill}
              className="w-full px-4 py-2 rounded-full border-2 border-[#1E3A8A] focus:outline-none focus:ring-2 focus:ring-[#FF5C00] bg-white text-[#1E3A8A]"
              placeholder="Add a category and press Enter"
            />
            <div className="mt-2 flex flex-wrap gap-2">
              {skills.map((cat, index) => (
                <div
                  key={index}
                  className="bg-[#FFE1A1] text-[#1E3A8A] px-3 py-1 rounded-full flex items-center"
                >
                  <span>{cat}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(cat)}
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
              await createFreelancer();
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

export default FreelancerProfileSetupModal;
