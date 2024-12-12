import mongoose from "mongoose";

const disputeSchema = new mongoose.Schema(
  {
    uid: {
      type: String,
      required: true,
    },
    refUID: {
      type: String,
      required: true,
    },
    validatorAddress: {
      type: String,
      required: true,
      lowercase: true,
    },
    validatorUID: {
      type: String,
      required: true,
    },
    clientFavor: {
      type: Number,
      required: true,
    },
    validationDescription: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: "disputes",
  }
);

export const Dispute = mongoose.model("Dispute", disputeSchema);
