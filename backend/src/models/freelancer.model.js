import mongoose from "mongoose";

const freelancerSchema = new mongoose.Schema(
  {
    uid: {
      type: String,
      required: true,
    },
    freelancerName: {
      type: String,
      required: true,
      trim: true,
    },
    freelancerAddress: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    freelancerBio: {
      type: String,
      required: true,
    },
    skills: [
      {
        type: String,
        required: true,
      },
    ],
    reputationScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    noOfGigsCompleted: {
      type: Number,
      default: 0,
    },
    noOfDisputesArised: {
      type: Number,
      default: 0,
    },
    noOfDisputesWon: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    collection: "freelancers",
  }
);

export const Freelancer = mongoose.model("Freelancer", freelancerSchema);
