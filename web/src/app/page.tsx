"use client";
import { useAccount } from "wagmi";
import Homepage from "@/components/pages/Homepage";

export default function Home() {
  const { address } = useAccount();
  return <Homepage />;
}
