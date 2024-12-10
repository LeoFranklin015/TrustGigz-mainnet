"use client";

import React, { useState, KeyboardEvent } from "react";
import { X } from "lucide-react";

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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-[#FDF7F0] rounded-xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
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
            type="submit"
            className="px-6 py-2 bg-[#FF5C00] rounded-full font-bold text-white border-2 border-[#1E3A8A] shadow-[0_4px_0_0_#1E3A8A] hover:shadow-[0_2px_0_0_#1E3A8A] hover:translate-y-[2px] transition-all"
          >
            Save Profile
          </button>
        </form>
      </div>
    </div>
  );
};

export default ClientProfileSetupModal;
