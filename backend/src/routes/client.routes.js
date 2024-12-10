import express from "express";
import { Client } from "../models/client.model.js";

const router = express.Router();

// Get client by address
router.get("/:address", async (req, res) => {
  try {
    const client = await Client.findOne({
      clientAddress: req.params.address.toLowerCase(),
    });

    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    res.json(client);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching client",
      error: error.message,
    });
  }
});

// Create new client
router.post("/", async (req, res) => {
  try {
    const { uid, clientName, clientAddress, clientBio, category } = req.body;

    // Check if client already exists
    const existingClient = await Client.findOne({
      clientAddress: clientAddress.toLowerCase(),
    });

    if (existingClient) {
      return res.status(400).json({
        message: "Client already registered",
      });
    }

    const newClient = new Client({
      uid,
      clientName,
      clientAddress: clientAddress.toLowerCase(),
      clientBio,
      category,
      reputationScore: 0,
      noOfJobsPosted: 0,
      noOfDisputesRaised: 0,
      noOfDisputesWon: 0,
    });

    await newClient.save();
    res.status(201).json(newClient);
  } catch (error) {
    res.status(500).json({
      message: "Error creating client",
      error: error.message,
    });
  }
});

// Update client
router.put("/:address", async (req, res) => {
  try {
    const updatedClient = await Client.findOneAndUpdate(
      { clientAddress: req.params.address.toLowerCase() },
      req.body,
      {
        // Return the updated document instead of the original
        new: true,
        // Run the validators on the updated document
        runValidators: true,
      }
    );

    if (!updatedClient) {
      return res.status(404).json({ message: "Client not found" });
    }

    res.json(updatedClient);
  } catch (error) {
    res.status(500).json({
      message: "Error updating client",
      error: error.message,
    });
  }
});

export default router;
