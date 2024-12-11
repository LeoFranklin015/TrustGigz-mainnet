import { createPublicClient, createWalletClient, custom } from "viem";
import { bscTestnet } from "viem/chains";
import { ethers } from "ethers";
import { useMemo } from "react";
import { useWalletClient } from "wagmi";

export const walletClient = createWalletClient({
  chain: bscTestnet,
  transport: custom(window.ethereum),
});

export const publicClient = createPublicClient({
  chain: bscTestnet,
  transport: custom(window.ethereum),
});

const getClient = () => {
  if (typeof window !== "undefined" && window.ethereum) {
    return createWalletClient({
      chain: bscTestnet,
      transport: custom(window.ethereum),
    });
  }
  return null;
};

const client = getClient();

export function walletClientToSigner(walletClient: any) {
  const { account, transport } = walletClient;
  const network = {
    chainId: bscTestnet.id,
    name: bscTestnet.name,
    ensAddress: "0x6c2270298b1e6046898a322acB3Cbad6F99f7CBD",
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
