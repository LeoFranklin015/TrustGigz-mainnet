import express from "express";
import { Gig } from "../models/gig.model.js";
import { Freelancer } from "../models/freelancer.model.js";

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
    console.log("Received gig creation request:", req.body);
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

    // Validate input
    if (!uid || !gigName || !gigContractAddress) {
      return res.status(400).json({
        message: "Missing required fields",
        receivedFields: Object.keys(req.body)
      });
    }

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
    console.error("Full error in gig creation:", error);
    res.status(500).json({
      message: "Error creating gig",
      error: error.message,
      stack: error.stack
    });
  }
});

// route to add applicant

router.post("/:uid", async (req, res) => {
  try {
    const { freelancerAddress, proposal } = req.body;
    const gig = await Gig.findOne({
      uid: req.params.uid.toLowerCase(),
    });
    if (!gig) {
      return res.status(404).json({ message: "Client not found" });
    }
    gig.applicants.push({ freelancerAddress, proposal });
    await gig.save();
    res.json(gig);
  } catch (error) {
    res.status(500).json({
      message: "Error adding applicant",
      error: error.message,
    });
  }
});

//Get Freelancer by address
router.get("/:uid/applicants", async (req, res) => {
  try {
    // fetch only applicants
    const uid = req.params.uid.toLowerCase();

    // Perform aggregation to fetch applicants with freelancer details
    const gig = await Gig.aggregate([
      {
        $match: { uid: uid },
      },
      {
        $lookup: {
          from: "freelancers", // Name of the freelancers collection
          localField: "applicants.freelancerAddress", // Field in the gigs collection
          foreignField: "freelancerAddress", // Field in the freelancers collection
          as: "freelancerDetails", // Alias for the joined data
        },
      },
      {
        $addFields: {
          applicants: {
            $map: {
              input: "$applicants",
              as: "applicant",
              in: {
                $mergeObjects: [
                  "$$applicant",
                  {
                    freelancerDetails: {
                      $arrayElemAt: [
                        {
                          $filter: {
                            input: "$freelancerDetails",
                            as: "freelancer",
                            cond: {
                              $eq: [
                                "$$freelancer.freelancerAddress",
                                "$$applicant.freelancerAddress",
                              ],
                            },
                          },
                        },
                        0,
                      ],
                    },
                  },
                ],
              },
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          uid: 1,
          gigName: 1,
          gigContractAddress: 1,
          gigDescription: 1,
          tags: 1,
          budget: 1,
          deadline: 1,
          clientAddress: 1,
          clientUID: 1,
          createdAt: 1,
          updatedAt: 1,
          __v: 1,
          isAccepted: 1,
          isCompleted: 1,
          freelancerAddress: 1,
          applicants: 1,
          freelancerUID: 1,
          isAccepted: 1,
          AggrementUid: 1,
          AIAttestationUID: 1,
          AIScore: 1,
          videoIpfsHash: 1,
          AIFeedback: 1,
          isDisputeRaised: 1,
          disputeAttestationUID: 1,
          disputeDescription: 1,
          isDisputed: 1,
          decision: 1,
          IsCompleted: 1,
          IsSubmitted: 1,
        },
      },
    ]);

    res.json(gig);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching applicants",
      error: error.message,
    });
  }
});

// Update client
router.put("/:uid", async (req, res) => {
  try {
    const updatedGig = await Gig.findOneAndUpdate(
      { uid: req.params.uid.toLowerCase() },
      req.body,
      {
        // Return the updated document instead of the original
        new: true,
        // Run the validators on the updated document
        runValidators: true,
      }
    );

    if (!updatedGig) {
      return res.status(404).json({ message: "Client not found" });
    }

    res.json(updatedGig);
  } catch (error) {
    res.status(500).json({
      message: "Error updating Gig",
      error: error.message,
    });
  }
});

export default router;
