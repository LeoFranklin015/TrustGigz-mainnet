import { createPublicClient, createWalletClient, custom } from "viem";
import { bsc } from "viem/chains";
import { ethers } from "ethers6";
import { useMemo } from "react";
import { useWalletClient } from "wagmi";

export const walletClient = createWalletClient({
  chain: bsc,
  transport: custom(window.ethereum),
});

export const publicClient = createPublicClient({
  chain: bsc,
  transport: custom(window.ethereum),
});

const getClient = () => {
  if (typeof window !== "undefined" && window.ethereum) {
    return createWalletClient({
      chain: bsc,
      transport: custom(window.ethereum),
    });
  }
  return null;
};

const client = getClient();

export function walletClientToSigner(walletClient: any) {
  const { account, transport } = walletClient;
  const network = {
    chainId: bsc.id,
    name: bsc.name,
    ensAddress: "0x247Fe62d887bc9410c3848DF2f322e52DA9a51bC",
  };
  const provider = new ethers.BrowserProvider(transport, network);
  const signer = new ethers.JsonRpcSigner(provider, account.address);
  return signer;
}

/** Hook to convert a viem Wallet Client to an ethers.js Signer. */
export function useEthersSigner({ chainId }: { chainId?: number } = {}) {
  const { data: walletClient } = useWalletClient({ chainId });
  return useMemo(
    () => (walletClient ? walletClientToSigner(walletClient) : undefined),
    [walletClient]
  );
}
