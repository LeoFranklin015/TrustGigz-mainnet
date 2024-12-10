import express from "express";
import { Freelancer } from "../models/freelancer.model.js";

const router = express.Router();

// Get freelancer by address
router.get("/:address", async (req, res) => {
  try {
    const freelancer = await Freelancer.findOne({
      freelancerAddress: req.params.address.toLowerCase(),
    });

    if (!freelancer) {
      return res.status(404).json({ message: "Freelancer not found" });
    }

    res.json(freelancer);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching freelancer",
      error: error.message,
    });
  }
});

// Create new freelancer
router.post("/", async (req, res) => {
  try {
    const { uid, freelancerName, freelancerAddress, freelancerBio, skills } = req.body;

    // Check if freelancer already exists
    const existingFreelancer = await Freelancer.findOne({
      freelancerAddress: freelancerAddress.toLowerCase(),
    });

    if (existingFreelancer) {
      return res.status(400).json({
        message: "Freelancer already registered",
      });
    }

    const freelancer = new Freelancer({
      uid,
      freelancerName,
      freelancerAddress: freelancerAddress.toLowerCase(),
      freelancerBio,
      skills,
      reputationScore: 0,
      noOfGigsCompleted: 0,
      noOfDisputesArised: 0,
      noOfDisputesWon: 0,
    });

    await freelancer.save();
    res.status(201).json(freelancer);
  } catch (error) {
    res.status(500).json({
      message: "Error creating freelancer",
      error: error.message,
    });
  }
});

// Update freelancer
router.put("/:address", async (req, res) => {
  try {
    const updatedFreelancer = await Freelancer.findOneAndUpdate(
      { freelancerAddress: req.params.address.toLowerCase() },
      req.body,
      {
        // Return the updated document instead of the original
        new: true,
        // Run the validators on the updated document
        runValidators: true,
      }
    );

    if (!updatedFreelancer) {
      return res.status(404).json({ message: "Freelancer not found" });
    }

    res.json(updatedFreelancer);
  } catch (error) {
    res.status(500).json({
      message: "Error updating freelancer",
      error: error.message,
    });
  }
});

export default router;
