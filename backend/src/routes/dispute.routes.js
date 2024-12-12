import express from "express";
import { Dispute } from "../models/dispute.model.js";

const router = express.Router();

// Create new client

router.get("/:refUID", async (req, res) => {
  try {
    const disputes = await Dispute.find({ refUID: req.params.refUID });
    res.json(disputes);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error fetching disputes",
      error: error.message,
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const {
      uid,
      refUID,
      validatorAddress,
      validatorUID,
      clientFavor,
      validationDescription,
    } = req.body;

    console.log("Received dispute creation request:", req.body);

    // Validate input
    if (
      !uid ||
      !refUID ||
      !validatorAddress ||
      !validatorUID ||
      clientFavor === undefined ||
      !validationDescription
    ) {
      return res.status(400).json({
        message: "Missing required fields",
        receivedFields: Object.keys(req.body),
      });
    }

    // Check if client already exists
    const existingDispute = await Dispute.findOne({
      uid,
    });

    if (existingDispute) {
      return res.status(400).json({
        message: "Dispute already registered",
      });
    }

    const newDispute = new Dispute({
      uid,
      refUID,
      validatorAddress,
      validatorUID,
      clientFavor,
      validationDescription,
    });

    await newDispute.save();
    res.status(201).json(newDispute);
  } catch (error) {
    console.error("Error in dispute creation:", error);
    res.status(500).json({
      message: "Error creating dispute",
      error: error.message,
      stack: error.stack,
    });
  }
});

export default router;
