/**
 * IBC v2 (ibc-go v10 / Eureka) MsgSendPacket helper
 *
 * cosmjs-types includes ibc.core.channel.v2.MsgSendPacket but does NOT include
 * a v2 FungibleTokenPacketData type. We therefore encode the ICS-20 payload as
 * JSON (application/json, version ics20-1) which ibc-go v10 can receive and
 * forward to the transfer application.
 */

import { EncodeObject, Registry } from '@cosmjs/proto-signing'
import { Payload } from 'cosmjs-types/ibc/core/channel/v2/packet'
import { MsgSendPacket } from 'cosmjs-types/ibc/core/channel/v2/tx'

const V2_MSG_SEND_PACKET_TYPE_URL = '/ibc.core.channel.v2.MsgSendPacket'

export interface V2TransferArgs {
  /** client ID on source chain (e.g. "07-tendermint-0" on Neutron pointing to CosmosHub) */
  sourceClient: string
  sender: string
  receiver: string
  denom: string
  amount: string

  /** optional memo — use this to experiment with next-hop payloads */
  memo?: string

  /** timeout in seconds from now, default 600 (10 min) */
  timeoutSeconds?: number
}

/** Build a v2 MsgSendPacket for an ICS-20 transfer */
export function buildV2TransferMsg(args: V2TransferArgs): EncodeObject {
  const {
    sourceClient,
    sender,
    receiver,
    denom,
    amount,
    memo = '',
    timeoutSeconds = 600,
  } = args

  // ICS-20 FungibleTokenPacketData encoded as JSON
  const packetData = JSON.stringify({
    denom,
    amount,
    sender,
    receiver,
    memo,
  })

  const payload = Payload.fromPartial({
    sourcePort: 'transfer',
    destinationPort: 'transfer',
    version: 'ics20-1',
    encoding: 'application/json',
    value: new TextEncoder().encode(packetData),
  })

  const timeoutTimestamp =
    BigInt(Date.now() + timeoutSeconds * 1000) * BigInt(1_000_000)

  const msgValue = MsgSendPacket.fromPartial({
    sourceClient,
    timeoutTimestamp,
    payloads: [payload],
    signer: sender,
  })

  return {
    typeUrl: V2_MSG_SEND_PACKET_TYPE_URL,
    value: MsgSendPacket.encode(msgValue).finish(),
  }
}

/** Create a Registry that includes the v2 MsgSendPacket type */
export function createV2Registry(): Registry {
  const registry = new Registry()
  registry.register(V2_MSG_SEND_PACKET_TYPE_URL, MsgSendPacket)
  return registry
}
