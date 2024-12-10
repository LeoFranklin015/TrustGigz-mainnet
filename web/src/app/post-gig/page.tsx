"use client";

import React, { useState, KeyboardEvent, useEffect } from "react";
import { X } from "lucide-react";
import { useAccount } from "wagmi";
import { checkClientRegistered } from "@/lib/BASHelpers/checkClientRegistered";
import Navbar from "@/components/ui/navbar";
import ClientProfileSetupModal from "@/components/modals/clientSetupModal";

export default function PostJob() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tag, setTag] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [budget, setBudget] = useState("");
  const [duration, setDuration] = useState("");
  const [registerdClient, setRegisteredClient] = useState(false);
  const [isOpen, setIsOpen] = useState(true);

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

  return (
    <div className="min-h-screen bg-[#FDF7F0] py-12 px-4">
      <Navbar />

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
              htmlFor="duration"
              className="block text-lg font-medium text-[#1E3A8A] mb-2"
            >
              Duration
            </label>
            <input
              type="text"
              id="duration"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full px-4 py-2 rounded-full border-2 border-[#1E3A8A] focus:outline-none focus:ring-2 focus:ring-[#FF5C00] bg-white text-[#1E3A8A]"
              placeholder="Enter project duration"
            />
          </div>
          <button
            type="submit"
            className="w-full px-6 py-3 bg-[#FF5C00] rounded-full font-bold text-white border-2 border-[#1E3A8A] shadow-[0_4px_0_0_#1E3A8A] hover:shadow-[0_2px_0_0_#1E3A8A] hover:translate-y-[2px] transition-all"
          >
            Post Gig
          </button>
        </form>
      </div>
    </div>
  );
}
