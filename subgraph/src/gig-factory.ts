import { GigCreated } from "../generated/GigFactory/GigFactory";
import { Gig } from "../generated/schema";
import { GigContract as GigTemplate } from "../generated/templates";

export function handleGigCreated(event: GigCreated): void {
  let gig = new Gig(event.params.gigId.toString());
  gig.contractAddress = event.params.GigContract;
  gig.client = event.params.client;
  gig.description = event.params.description;
  gig.budget = event.params.budget;
  gig.deadline = event.params.deadline;
  gig.isAccepted = false;
  gig.isCompleted = false;
  gig.isDisputed = false;
  gig.createdAt = event.block.timestamp;
  gig.updatedAt = event.block.timestamp;
  gig.save();

  // Dynamically track this GigContract
  GigTemplate.create(event.params.GigContract);
}
