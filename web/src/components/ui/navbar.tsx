"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
import { createWeb3Name } from "@web3-name-sdk/core";

const Navbar = () => {
  const web3name = createWeb3Name();
  const [web3Name, setWeb3Name] = useState("");
  const fetchedForAccount = useRef({ account: "", chainId: 97 });

  const fetchWeb3Name = async (account: any, chain: any) => {
    if (account && chain) {
      try {
        const webName = await web3name.getDomainName({
          address: account.address,
          queryChainIdList: [1, chain.id],
        });
        console.log("Fetched Web3 Name:", webName);
        if (webName) {
          setWeb3Name(webName);
        }
      } catch (error) {
        console.error("Error fetching Web3 name:", error);
      }
    }
  };

  return (
    <nav className="border-b border-black bg-[#FDF7F0] p-2 w-full mx-auto">
      <div className="w-full mx-auto flex items-center justify-between px-8">
        <div className="flex items-center space-x-2">
          <div className="text-3xl font-black text-black">TrustGigz</div>
        </div>
        <div className="hidden lg:flex items-center space-x-6 text-black justify-between">
          <Link
            href="/yourgigs"
            className="hover:text-[#FF5C00] transition-colors font-medium"
          >
            Your Gigs
          </Link>
          <Link
            href="/post-gig"
            className="hover:text-[#FF5C00] transition-colors font-medium"
          >
            Post a Gig
          </Link>
          <Link
            href="/gigs"
            className="hover:text-[#FF5C00] transition-colors font-medium"
          >
            Find a Gig
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          <ConnectButton.Custom>
            {({
              account,
              chain,
              openAccountModal,
              openChainModal,
              openConnectModal,
              authenticationStatus,
              mounted,
            }) => {
              const ready = mounted && authenticationStatus !== "loading";
              const connected =
                ready &&
                account &&
                chain &&
                (!authenticationStatus ||
                  authenticationStatus === "authenticated");

              useEffect(() => {
                if (
                  connected &&
                  (fetchedForAccount.current.account !== account.address ||
                    fetchedForAccount.current.chainId !== chain.id)
                ) {
                  fetchWeb3Name(account, chain);
                  fetchedForAccount.current = {
                    account: account.address,
                    chainId: chain.id,
                  };
                }
              }, [connected, account, chain]);

              return (
                <div
                  {...(!ready && {
                    "aria-hidden": true,
                    style: {
                      opacity: 0,
                      pointerEvents: "none",
                      userSelect: "none",
                    },
                  })}
                >
                  {!connected ? (
                    <button
                      onClick={openConnectModal}
                      type="button"
                      className="px-6 py-2 bg-[#FF5C00] rounded-full font-bold text-white border-2 border-[#1E3A8A] shadow-[0_4px_0_0_#1E3A8A] hover:shadow-[0_2px_0_0_#1E3A8A] hover:translate-y-[2px] transition-all"
                    >
                      Connect Wallet
                    </button>
                  ) : chain.unsupported ? (
                    <button
                      onClick={openChainModal}
                      type="button"
                      className="px-6 py-2 bg-[#FF5C00] rounded-full font-bold text-white border-2 border-[#1E3A8A] shadow-[0_4px_0_0_#1E3A8A] hover:shadow-[0_2px_0_0_#1E3A8A] hover:translate-y-[2px] transition-all"
                    >
                      Wrong network
                    </button>
                  ) : (
                    <div style={{ display: "flex", gap: 12 }}>
                      <button
                        onClick={openChainModal}
                        style={{ display: "flex", alignItems: "center" }}
                        type="button"
                        className="px-6 py-2 bg-[#FFE1A1] rounded-full font-bold text-black border-2 border-[#1E3A8A] shadow-[0_4px_0_0_#1E3A8A] hover:shadow-[0_2px_0_0_#1E3A8A] hover:translate-y-[2px] transition-all"
                      >
                        {chain.hasIcon && (
                          <div
                            style={{
                              background: chain.iconBackground,
                              width: 24,
                              height: 23,
                              borderRadius: 999,
                              overflow: "hidden",
                              marginRight: 4,
                            }}
                          >
                            {chain.iconUrl && (
                              <img
                                alt={chain.name ?? "Chain icon"}
                                src={chain.iconUrl}
                                style={{ width: 24, height: 24 }}
                              />
                            )}
                          </div>
                        )}
                        {chain.name}
                      </button>

                      <button
                        onClick={openAccountModal}
                        type="button"
                        className="px-6 py-2 bg-[#FF5C00] rounded-full font-bold text-white border-2 border-[#1E3A8A] shadow-[0_4px_0_0_#1E3A8A] hover:shadow-[0_2px_0_0_#1E3A8A] hover:translate-y-[2px] transition-all"
                      >
                        {web3Name ? web3Name : account.displayName}
                        {account.displayBalance
                          ? ` (${account.displayBalance})`
                          : ""}
                      </button>
                    </div>
                  )}
                </div>
              );
            }}
          </ConnectButton.Custom>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
