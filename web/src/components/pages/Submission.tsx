"use client";

import { useState } from "react";
import { VideoUploader } from "@/components/ui/videoUpload";
import { VideoPlayer } from "@/components/ui/videoPlayer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import OpenAI from "openai";
import Navbar from "@/components/ui/navbar";
import { BAS, SchemaEncoder } from "@bnb-attestation-service/bas-sdk";
import { publicClient, useEthersSigner, walletClient } from "@/lib/viemClient";
import { bscTestnet } from "viem/chains";
import { aiAttestationSchema, aiAttestationSchemaUID } from "@/lib/const";
import { privateKeyToAccount } from "viem/accounts";
import { GigContractABI } from "@/lib/abis/GigContract";
import { PinataSDK } from "pinata-web3";
import axios from "axios";
import { useAccount } from "wagmi";

export default function SubmissionPage({
  description,
  gigContarctAddress,
  gigUID,
  freelancerUID,
}: {
  description: any;
  gigContarctAddress: any;
  gigUID: any;
  freelancerUID: any;
}) {
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [summary, setSummary] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [IpfsHash, setIpfsHash] = useState("");
  const { address } = useAccount();

  const openai = new OpenAI({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY || "",
    dangerouslyAllowBrowser: true,
  });

  const BASContractAddress = "0x6c2270298b1e6046898a322acB3Cbad6F99f7CBD"; //bnb testnet
  const bas = new BAS(BASContractAddress);
  const signer = useEthersSigner({ chainId: bscTestnet.id });

  const extractFrames = async (
    file: File,
    numFrames = 5
  ): Promise<string[]> => {
    return new Promise((resolve, reject) => {
      const video = document.createElement("video");
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject("Canvas context is not supported.");
        return;
      }

      const frames: string[] = [];
      video.src = URL.createObjectURL(file);

      video.onloadedmetadata = () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const interval = video.duration / numFrames;
        let currentFrame = 0;

        const captureFrame = () => {
          if (currentFrame >= numFrames) {
            resolve(frames);
            return;
          }

          video.currentTime = currentFrame * interval;
          currentFrame++;
        };

        video.onseeked = () => {
          try {
            ctx.drawImage(video, 0, 0);
            frames.push(canvas.toDataURL("image/jpeg", 0.5));
            captureFrame();
          } catch (err) {
            reject(`Error capturing frame: ${err}`);
          }
        };

        captureFrame();
      };

      video.onerror = (error) => {
        reject(`Error loading video: ${error}`);
      };
    });
  };

  const analyzeVideo = async (frames: string[]) => {
    try {
      const base64Frames = frames.map((dataUrl) => ({
        type: "image_url",
        image_url: {
          url: dataUrl,
        },
      }));

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `Analyze these frames from a video and check the validity with the description provided below. Include visual context, actions, and any important details you observe.Description: ${description}. With this discussion, Evaluate the work submitted and please give us the relavant score for the work.
                For Example :  desc : A modal to get the details of the client with his name , email and phone number.
                Your analysis : The client has been given a modal to get the details of the client with his name and email .
                Here the phone number is missing . So kindly give the score out of 100 for the work submitted.Kidly restrict your response in JSON format with the keys as "score" and "feedback"

                Example : {
                "score": 50,
                "feedback": "The work submitted is incomplete. There was no phone number provided."
              }

              Strictly follow the above format.Also dont need to add any additional text.Also dont add json with backslash to the response.
                `,
              },
              {
                type: "image_url",
                image_url: {
                  url: frames[0],
                },
              },
              {
                type: "image_url",
                image_url: {
                  url: frames[1],
                },
              },
              {
                type: "image_url",
                image_url: {
                  url: frames[2],
                },
              },
              {
                type: "image_url",
                image_url: {
                  url: frames[3],
                },
              },
              {
                type: "image_url",
                image_url: {
                  url: frames[4],
                },
              },
            ],
          },
        ],
        max_tokens: 500,
      });

      return response.choices[0].message.content;
    } catch (error) {
      console.error("Error analyzing video:", error);
      throw new Error("Failed to analyze video content");
    }
  };

  const handleVideoSelect = (file: File) => {
    setFile(file);
    const url = URL.createObjectURL(file);

    setVideoUrl(url);
    setVideoFile(file);
    setSummary("");
    setError("");
  };

  const handleAnalyzeVideo = async () => {
    if (!videoFile) {
      setError("Please upload a video first");
      return;
    }

    try {
      setIsLoading(true);
      setError("");

      const frames = await extractFrames(videoFile);
      const summary = await analyzeVideo(frames);
      console.log(summary);
      const cleanedSummary = summary!.replace(/```json|```/g, "").trim();
      const hash = await uploadVideoToIPFS();
      setSummary(cleanedSummary || "No summary available");
      const jsonSummary = JSON.parse(cleanedSummary);
      setScore(jsonSummary.score);
      setFeedback(jsonSummary.feedback);

      // await createAttestation({
      //   hash,
      //   score: jsonSummary.score,
      //   feedback: jsonSummary.feedback,
      // });
    } catch (err) {
      setError("Failed to analyze video. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Create AI Attestation
  const createAttestation = async ({
    hash,
    score,
    feedback,
  }: {
    hash: any;
    score: any;
    feedback: any;
  }) => {
    try {
      console.log(
        {
          message: "Creating AI attestation",
          gigUID,
          score,
          feedback,
          freelancerUID,
          hash,
        },
        { structuredData: true }
      );

      const schemeEncoder = new SchemaEncoder(aiAttestationSchema);
      const encodedData = schemeEncoder.encodeData([
        { name: "refUID", value: gigUID, type: "bytes32" },
        { name: "aiScore", value: BigInt(score), type: "uint256" },
        { name: "aiFeedback", value: feedback, type: "string" },
        { name: "freelancerUID", value: freelancerUID, type: "bytes32" },
        { name: "videoIpfsHash", value: hash, type: "string" },
      ]);
      const schemaUID = aiAttestationSchemaUID;
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

      const aiAttestationUID = await tx.wait();

      console.log(aiAttestationUID);

      // Set the Attestation UID in the contract
      const txHash = await walletClient.writeContract({
        account: address!,
        address: gigContarctAddress,
        abi: GigContractABI,
        functionName: "submitWork",
        args: [aiAttestationUID, score, aiAttestationUID],
      });

      await publicClient.waitForTransactionReceipt({
        hash: txHash,
      });

      // Add the data to the indexer

      const data = await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/gig/${gigUID}`,
        {
          IsSubmitted: true,
          AIAttestationUID: aiAttestationUID,
          AIScore: score,
          videoIpfsHash: hash,
          AIFeedback: feedback,
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  const uploadVideoToIPFS = async () => {
    const pinata = new PinataSDK({
      pinataJwt: process.env.NEXT_PUBLIC_PINATA_JWT,
      pinataGateway: "orange-select-opossum-767.mypinata.cloud",
    });

    const upload = await pinata.upload.file(file!);
    console.log(upload.IpfsHash);
    setIpfsHash(upload.IpfsHash);
    return upload.IpfsHash;
  };

  return (
    <div className="min-h-screen bg-[#FDF7F0]">
      <div className="container mx-auto px-4 py-8">
        <Card className="mb-8 border-2 border-[#1E3A8A] shadow-[0_6px_0_0_#1E3A8A]">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-[#1E3A8A]">
              Submit your work
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {!videoUrl && <VideoUploader onVideoSelect={handleVideoSelect} />}

            {videoUrl && (
              <div className="space-y-6">
                <VideoPlayer videoUrl={videoUrl} />

                <div className="flex justify-center">
                  <Button
                    onClick={handleAnalyzeVideo}
                    disabled={isLoading}
                    className="bg-[#FF5C00] text-white border-2 border-[#1E3A8A] shadow-[0_4px_0_0_#1E3A8A] hover:shadow-[0_2px_0_0_#1E3A8A] hover:translate-y-[2px] transition-all"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      "Analyze Content"
                    )}
                  </Button>
                </div>
                {summary && (
                  <div className="p-4 bg-[#FDF7F0] rounded-lg border-2 border-[#1E3A8A] shadow-[0_4px_0_0_#1E3A8A]">
                    <h2 className="text-lg font-bold text-[#1E3A8A] mb-2">
                      Analysis Summary
                    </h2>
                    <p className="text-[#1E3A8A]">Score : {score}</p>
                    <p className="text-[#1E3A8A]">Feedback : {feedback}</p>
                  </div>
                )}

                {error && (
                  <div className="p-4 bg-[#FFE1A1] text-[#1E3A8A] rounded-lg border-2 border-[#1E3A8A]">
                    {error}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
