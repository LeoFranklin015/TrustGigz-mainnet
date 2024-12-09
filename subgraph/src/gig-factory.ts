import { GigCreated as GigCreatedEvent } from "../generated/GigFactory/GigFactory"
import { GigCreated } from "../generated/schema"

export function handleGigCreated(event: GigCreatedEvent): void {
  let entity = new GigCreated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.GigContract = event.params.GigContract
  entity.client = event.params.client
  entity.timestamp = event.params.timestamp

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
