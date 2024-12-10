import mongoose from "mongoose";

const clientSchema = new mongoose.Schema(
  {
    uid: {
      type: String,
      required: true,
    },
    clientName: {
      type: String,
      required: true,
      trim: true,
    },
    clientAddress: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    clientBio: {
      type: String,
      required: true,
    },
    category: [
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
    noOfJobsPosted: {
      type: Number,
      default: 0,
    },
    noOfDisputesRaised: {
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
    collection: "clients",
  }
);

export const Client = mongoose.model("Client", clientSchema);
