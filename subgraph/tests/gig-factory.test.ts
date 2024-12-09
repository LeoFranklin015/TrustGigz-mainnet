import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { Address, BigInt } from "@graphprotocol/graph-ts"
import { GigCreated } from "../generated/schema"
import { GigCreated as GigCreatedEvent } from "../generated/GigFactory/GigFactory"
import { handleGigCreated } from "../src/gig-factory"
import { createGigCreatedEvent } from "./gig-factory-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let GigContract = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let client = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let timestamp = BigInt.fromI32(234)
    let newGigCreatedEvent = createGigCreatedEvent(
      GigContract,
      client,
      timestamp
    )
    handleGigCreated(newGigCreatedEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("GigCreated created and stored", () => {
    assert.entityCount("GigCreated", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "GigCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "GigContract",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "GigCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "client",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "GigCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "timestamp",
      "234"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
