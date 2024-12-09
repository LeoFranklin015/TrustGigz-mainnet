import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import { GigCreated } from "../generated/GigFactory/GigFactory"

export function createGigCreatedEvent(
  GigContract: Address,
  client: Address,
  timestamp: BigInt
): GigCreated {
  let gigCreatedEvent = changetype<GigCreated>(newMockEvent())

  gigCreatedEvent.parameters = new Array()

  gigCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "GigContract",
      ethereum.Value.fromAddress(GigContract)
    )
  )
  gigCreatedEvent.parameters.push(
    new ethereum.EventParam("client", ethereum.Value.fromAddress(client))
  )
  gigCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "timestamp",
      ethereum.Value.fromUnsignedBigInt(timestamp)
    )
  )

  return gigCreatedEvent
}
