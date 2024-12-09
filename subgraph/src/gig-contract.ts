//Add The appropriate Event handlers for the GigContract

import { Applicant, Gig } from "../generated/schema";
import {
  GigAccepted,
  GigApplied,
  WorkSubmitted,
  DisputeRaised,
  DisputeResolved,
  PaymentReleased,
} from "../generated/templates/GigContract/GigContract";

export function handleGigApplied(event: GigApplied): void {
  let applicant = new Applicant(event.params.freelancer.toString());

  applicant.gig = event.params.gigId.toString();
  applicant.freelancer = event.params.freelancer;
  applicant.proposal = event.params.proposal;
  applicant.save();
}

export function handleGigAccepted(event: GigAccepted): void {
  let gig = Gig.load(event.params.gigId.toString());
  if (gig) {
    gig.freelancer = event.params.freelancer;
    gig.isAccepted = true;
    gig.attestationUID = event.params.attestationUID;
    gig.updatedAt = event.block.timestamp;
    gig.save();
  }
}

export function handleWorkSubmitted(event: WorkSubmitted): void {
  let gig = Gig.load(event.params.gigId.toString());
  if (gig) {
    gig.aiScore = event.params.aiScore;
    gig.aiAttestationUID = event.params.aiAttestationUID;
    gig.updatedAt = event.block.timestamp;
    gig.save();
  }
}

export function handleDisputeRaised(event: DisputeRaised): void {
  let gig = Gig.load(event.params.gigId.toString());
  if (gig) {
    gig.disputingParty = event.params.disputingParty;
    gig.disputeAttestationUID = event.params.disputeAttestationUID;
    gig.disputeDescription = event.params.description;
    gig.isDisputed = true;
    gig.disputeResolved = false;
    gig.updatedAt = event.block.timestamp;
    gig.save();
  }
}

export function handleDisputeResolved(event: DisputeResolved): void {
  let gig = Gig.load(event.params.gigId.toString());
  if (gig) {
    gig.disputeResolved = true;
    gig.disputeResolvedDecision = event.params.decision;
    gig.disputeAttestationUID = event.params.disputeAttestationUID.toString();
    gig.isDisputed = false;
    gig.isCompleted = true;
    gig.updatedAt = event.block.timestamp;
    gig.save();
  }
}

export function handlePaymentReleased(event: PaymentReleased): void {
  let gig = Gig.load(event.params.gigId.toString());
  if (gig) {
    gig.isCompleted = true;
    gig.updatedAt = event.block.timestamp;
    gig.save();
  }
}
