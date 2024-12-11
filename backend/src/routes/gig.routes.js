import express from "express";
import { Gig } from "../models/gig.model.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const gigs = await Gig.find();
    res.json(gigs);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching gigs",
      error: error.message,
    });
  }
});

// Get client by address
router.get("/:uid", async (req, res) => {
  try {
    const gig = await Gig.findOne({
      uid: req.params.uid.toLowerCase(),
    });

    if (!gig) {
      return res.status(404).json({ message: "Client not found" });
    }

    res.json(gig);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching gig",
      error: error.message,
    });
  }
});

// Create new gig
router.post("/", async (req, res) => {
  try {
    const {
      uid,
      gigName,
      gigContractAddress,
      gigDescription,
      tags,
      budget,
      deadline,
      clientAddress,
      clientUID,
    } = req.body;

    // Check if gig already exists
    const existingGig = await Gig.findOne({
      uid: uid.toLowerCase(),
    });

    if (existingGig) {
      return res.status(400).json({
        message: "Gig already registered",
      });
    }

    const newGig = new Gig({
      uid,
      gigName,
      gigContractAddress,
      gigDescription,
      tags,
      budget,
      deadline,
      clientAddress,
      clientUID,
      isAccepted: false,
      isCompleted: false,
    });

    await newGig.save();
    res.status(201).json(newGig);
  } catch (error) {
    res.status(500).json({
      message: "Error creating gig",
      error: error.message,
    });
  }
});

// Update client
// router.put("/:address", async (req, res) => {
//   try {
//     const updatedClient = await Client.findOneAndUpdate(
//       { clientAddress: req.params.address.toLowerCase() },
//       req.body,
//       {
//         // Return the updated document instead of the original
//         new: true,
//         // Run the validators on the updated document
//         runValidators: true,
//       }
//     );

//     if (!updatedClient) {
//       return res.status(404).json({ message: "Client not found" });
//     }

//     res.json(updatedClient);
//   } catch (error) {
//     res.status(500).json({
//       message: "Error updating client",
//       error: error.message,
//     });
//   }
// });

export default router;
