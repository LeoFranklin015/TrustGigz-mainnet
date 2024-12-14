"use client";

import React, { useState, KeyboardEvent, useEffect } from "react";
import { X } from "lucide-react";
import { useAccount } from "wagmi";
import { checkClientRegistered } from "@/lib/BASHelpers/checkClientRegistered";
import Navbar from "@/components/ui/navbar";
import ClientProfileSetupModal from "@/components/modals/clientSetupModal";
import { publicClient, useEthersSigner, walletClient } from "@/lib/viemClient";
import { gigFactoryAddress, gigSchema, gigSchemaUID } from "@/lib/const";
import { GigFactoryContractABI } from "@/lib/abis/GigFactory";
import { decodeEventLog, parseEther } from "viem";
import { BAS, SchemaEncoder } from "@bnb-attestation-service/bas-sdk";
import { bscTestnet } from "viem/chains";
import axios from "axios";
import {
  ApplicationStepper,
  StepperModal,
  StepStatus,
} from "../modals/Stepper";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export default function PostJob() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tag, setTag] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [budget, setBudget] = useState("");
  const [deadline, setDeadline] = useState("");
  const [registerdClient, setRegisteredClient] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const [client, setClient] = useState<any | null>(null);

  const [postGigSteps, setPostGigSteps] = useState([
    { label: "Contract Interaction", status: "idle" as StepStatus },
    { label: "Attestation", status: "idle" as StepStatus },
    { label: "Indexing", status: "idle" as StepStatus },
  ]);
  const [postGigStepper, setPostGigStepper] = useState(false);

  const BASContractAddress = "0x6c2270298b1e6046898a322acB3Cbad6F99f7CBD"; //bnb testnet
  const bas = new BAS(BASContractAddress);
  const signer = useEthersSigner({ chainId: bscTestnet.id });

  const handleAddTag = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tag.trim()) {
      e.preventDefault();
      setTags([...tags, tag.trim()]);
      setTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const { address } = useAccount();
  useEffect(() => {
    const checkAlreadyRegistered = async () => {
      const check = await checkClientRegistered(address!);
      if (check !== false) {
        setClient(check);
        setRegisteredClient(true);
      }
      setRegisteredClient(check);
      console.log(check);
    };
    if (address) {
      checkAlreadyRegistered();
    }
  }, [address, isOpen]);

  useEffect(() => {
    if (registerdClient) {
      setIsOpen(false);
    }
  }, [registerdClient]);

  const updateStepStatus = (
    index: number,
    status: "idle" | "loading" | "complete" | "error"
  ) => {
    setPostGigSteps((steps: any) =>
      steps.map((step: any, i: any) =>
        i === index ? { ...step, status } : step
      )
    );
  };

  const createGig = async () => {
    // Create a gig in the contract.
    setPostGigStepper(true);
    try {
      updateStepStatus(0, "loading");
      const txhash = await walletClient.writeContract({
        account: address!,
        address: gigFactoryAddress,
        abi: GigFactoryContractABI,
        functionName: "createGig",
        args: [
          JSON.stringify({ title, description, tags }),
          BigInt(budget),
          BigInt(deadline),
        ],
        value: BigInt(budget),
      });

      console.log(txhash);

      const reciept = await publicClient.waitForTransactionReceipt({
        hash: txhash,
      });
      console.log(reciept.logs);
      updateStepStatus(0, "complete");

      const eventLogs = decodeEventLog({
        abi: GigFactoryContractABI,
        data: reciept.logs[0].data,
        topics: reciept.logs[0].topics,
      });
      console.log(eventLogs);

      const gigContarctAddress = (eventLogs.args as any).GigContract;

      // Create the GIG in the BAS attestation service.

      updateStepStatus(1, "loading");

      const schemeEncoder = new SchemaEncoder(gigSchema);
      const encodedData = schemeEncoder.encodeData([
        { name: "gigTitle", value: title, type: "string" },
        { name: "gigDescription", value: description, type: "string" },
        { name: "gigTags", value: tags, type: "string[]" },
        { name: "gigBudget", value: BigInt(budget), type: "uint256" },
        { name: "gigDeadliine", value: BigInt(deadline), type: "uint256" },
        { name: "gigClient", value: address!, type: "address" },
        { name: "gigClientUID", value: client!.uid, type: "bytes32" },
        {
          name: "gigContractAddress",
          value: gigContarctAddress,
          type: "address",
        },
      ]);
      const schemaUID = gigSchemaUID;
      bas.connect(signer!);
      const tx = await bas.attest({
        schema: schemaUID,
        data: {
          recipient: gigContarctAddress,
          expirationTime: BigInt(0),
          revocable: true, // Be aware that if your schema is not revocable, this MUST be false
          data: encodedData,
        },
      });

      const gigAttestationUID = await tx.wait();
      console.log(gigAttestationUID);
      if (gigAttestationUID) {
        updateStepStatus(1, "complete");
      }

      // Store the Attestion in Backend to index.
      updateStepStatus(2, "loading");
      const dbData = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/gig`,
        {
          gigName: title,
          gigDescription: description,
          tags: tags,
          budget: budget,
          deadline: deadline,
          clientAddress: address!,
          gigContractAddress: gigContarctAddress,
          uid: gigAttestationUID,
          clientUID:
            "0xbd91a7bbd682b18534eee56177d92e648b7a2d64c8ee9be7156015552fbdad3f",
        }
      );
      console.log(dbData);
      if (dbData) {
        updateStepStatus(2, "complete");
      }
    } catch (error) {
      const currentStep = postGigSteps.findIndex(
        (step) => step.status === "loading"
      );
      if (currentStep !== -1) {
        updateStepStatus(currentStep, "error");
      }
      console.log(error);
    } finally {
      setTimeout(() => setPostGigStepper(false), 3000);
      // navigate("/");
      window.location.href = "/yourgigs";
    }
  };

  return (
    <div className="min-h-screen bg-[#FDF7F0] py-12 px-4">
      <Navbar />
      {address && !registerdClient && (
        <ClientProfileSetupModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
        />
      )}
      <StepperModal isOpen={postGigStepper} steps={postGigSteps} />
      <div className="container mx-auto max-w-2xl">
        <h1 className="text-4xl font-black text-[#1E3A8A] mb-8 text-center mt-4">
          Post a New Gig
        </h1>
        <form className="space-y-6 bg-white p-8 rounded-xl border-2 border-[#1E3A8A] shadow-[0_6px_0_0_#1E3A8A]">
          <div>
            <label
              htmlFor="title"
              className="block text-lg font-medium text-[#1E3A8A] mb-2"
            >
              Gig Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 rounded-full border-2 border-[#1E3A8A] focus:outline-none focus:ring-2 focus:ring-[#FF5C00] bg-white text-[#1E3A8A]"
              placeholder="Enter job title"
            />
          </div>
          <div>
            <label
              htmlFor="description"
              className="block text-lg font-medium text-[#1E3A8A] mb-2"
            >
              Gig Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border-2 border-[#1E3A8A] focus:outline-none focus:ring-2 focus:ring-[#FF5C00] bg-white text-[#1E3A8A] h-32 resize-none"
              placeholder="Describe the job requirements"
            />
          </div>
          <div>
            <label
              htmlFor="tag"
              className="block text-lg font-medium text-[#1E3A8A] mb-2"
            >
              Tags
            </label>
            <input
              type="text"
              id="tag"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              onKeyDown={handleAddTag}
              className="w-full px-4 py-2 rounded-full border-2 border-[#1E3A8A] focus:outline-none focus:ring-2 focus:ring-[#FF5C00] bg-white text-[#1E3A8A]"
              placeholder="Add a tag and press Enter"
            />
            <div className="mt-2 flex flex-wrap gap-2">
              {tags.map((t, index) => (
                <div
                  key={index}
                  className="bg-[#FFE1A1] text-[#1E3A8A] px-3 py-1 rounded-full flex items-center"
                >
                  <span>{t}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(t)}
                    className="ml-2 focus:outline-none"
                  >
                    <X size={16} className="text-[#1E3A8A]" />
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div>
            <label
              htmlFor="budget"
              className="block text-lg font-medium text-[#1E3A8A] mb-2"
            >
              Budget
            </label>
            <input
              type="text"
              id="budget"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="w-full px-4 py-2 rounded-full border-2 border-[#1E3A8A] focus:outline-none focus:ring-2 focus:ring-[#FF5C00] bg-white text-[#1E3A8A]"
              placeholder="Enter budget"
            />
          </div>
          <div>
            <label
              htmlFor="Deadline"
              className="block text-lg font-medium text-[#1E3A8A] mb-2"
            >
              Deadline
            </label>
            <input
              type="text"
              id="Deadline"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full px-4 py-2 rounded-full border-2 border-[#1E3A8A] focus:outline-none focus:ring-2 focus:ring-[#FF5C00] bg-white text-[#1E3A8A]"
              placeholder="Enter project Deadline"
            />
          </div>
          <button
            type="submit"
            className="w-full px-6 py-3 bg-[#FF5C00] rounded-full font-bold text-white border-2 border-[#1E3A8A] shadow-[0_4px_0_0_#1E3A8A] hover:shadow-[0_2px_0_0_#1E3A8A] hover:translate-y-[2px] transition-all"
            onClick={async (e) => {
              e.preventDefault();
              await createGig();
            }}
          >
            Post Gig
          </button>
        </form>
      </div>
    </div>
  );
}
