import { EncodeObject } from '@cosmjs/proto-signing'
import { MsgTransfer } from 'cosmjs-types/ibc/applications/transfer/v1/tx'

import { type useIbcTestWallet } from 'hooks/useIbcTestWallet'

/*
 * ──────────────────────────────────────────────────────────────────────────────
 * Confirmed channel / client constants (Phase 0 verification)
 * ──────────────────────────────────────────────────────────────────────────────
 */

// IBC v1 transfer channels
const OSMO_TO_NEUTRON_CHANNEL = 'channel-874' // Osmosis → Neutron (neutron side: channel-10)
const OSMO_TO_COSMOSHUB_CHANNEL = 'channel-0' // Osmosis → CosmosHub (hub side: channel-141)
const COSMOSHUB_TO_NEUTRON_CHANNEL = 'channel-569' // CosmosHub → Neutron (neutron side: channel-1)

// IBC v2 sourceClient IDs (ibc-go v10 MsgSendPacket)
const NEUTRON_CLIENT_FOR_COSMOSHUB = '07-tendermint-0' // Neutron → CosmosHub v2
const COSMOSHUB_CLIENT_FOR_NEUTRON = '07-tendermint-1119' // CosmosHub → Neutron v2
/** CosmosHub → Babylon v2 client (07-tendermint-1381). Exported for reference / future use. */
export const COSMOSHUB_CLIENT_FOR_BABYLON = '07-tendermint-1381'
// Note: Neutron → Babylon client ID (needed for scenario ⑥) — TBD: query neutron-rpc.publicnode.com

/*
 * ──────────────────────────────────────────────────────────────────────────────
 * Scenario type
 * ──────────────────────────────────────────────────────────────────────────────
 */

export interface Scenario {
  id: number
  title: string
  route: string
  token: string
  description: string
  sourceChainId: string
  run: (
    wallet: ReturnType<typeof useIbcTestWallet>,
    amount: string
  ) => Promise<{ transactionHash: string }>
}

/*
 * ──────────────────────────────────────────────────────────────────────────────
 * Helpers
 * ──────────────────────────────────────────────────────────────────────────────
 */

function timeoutTimestamp(seconds = 600): bigint {
  return BigInt(Date.now() + seconds * 1000) * BigInt(1_000_000)
}

/*
 * ──────────────────────────────────────────────────────────────────────────────
 * Scenario ①: v1 ICS-20 simple transfer
 * Osmosis → Neutron, uosmo
 * ──────────────────────────────────────────────────────────────────────────────
 */

function runScenario1(
  wallet: ReturnType<typeof useIbcTestWallet>,
  amount: string
): Promise<{ transactionHash: string }> {
  const msg: EncodeObject = {
    typeUrl: '/ibc.applications.transfer.v1.MsgTransfer',
    value: MsgTransfer.fromPartial({
      sourcePort: 'transfer',
      sourceChannel: OSMO_TO_NEUTRON_CHANNEL,
      token: { denom: 'uosmo', amount },
      sender: wallet.addresses.osmosis,
      receiver: wallet.addresses.neutron,
      timeoutTimestamp: timeoutTimestamp(),
    }),
  }
  return wallet.sendTx('osmosis', [msg])
}

/*
 * ──────────────────────────────────────────────────────────────────────────────
 * Scenario ②: v1 + classic PFM (Osmosis → CosmosHub PFM → Neutron)
 * ──────────────────────────────────────────────────────────────────────────────
 */

function runScenario2(
  wallet: ReturnType<typeof useIbcTestWallet>,
  amount: string
): Promise<{ transactionHash: string }> {
  const pfmMemo = JSON.stringify({
    forward: {
      receiver: wallet.addresses.neutron,
      port: 'transfer',
      channel: COSMOSHUB_TO_NEUTRON_CHANNEL,
      timeout: '10m',
      retries: 2,
    },
  })

  const msg: EncodeObject = {
    typeUrl: '/ibc.applications.transfer.v1.MsgTransfer',
    value: MsgTransfer.fromPartial({
      sourcePort: 'transfer',
      sourceChannel: OSMO_TO_COSMOSHUB_CHANNEL,
      token: { denom: 'uosmo', amount },
      sender: wallet.addresses.osmosis,
      receiver: wallet.addresses.cosmoshub,
      memo: pfmMemo,
      timeoutTimestamp: timeoutTimestamp(),
    }),
  }
  return wallet.sendTx('osmosis', [msg])
}

/*
 * ──────────────────────────────────────────────────────────────────────────────
 * Scenario ③: v2 MsgSendPacket → v1 arrival experiment
 * Neutron(v2) → CosmosHub, untrn
 * ──────────────────────────────────────────────────────────────────────────────
 */

async function runScenario3(
  wallet: ReturnType<typeof useIbcTestWallet>,
  amount: string
): Promise<{ transactionHash: string }> {
  const { buildV2TransferMsg, createV2Registry } = await import('ics20/v2-msg')
  const msg = buildV2TransferMsg({
    sourceClient: NEUTRON_CLIENT_FOR_COSMOSHUB,
    sender: wallet.addresses.neutron,
    receiver: wallet.addresses.cosmoshub,
    denom: 'untrn',
    amount,
  })
  return wallet.sendTx('neutron', [msg], createV2Registry())
}

/*
 * ──────────────────────────────────────────────────────────────────────────────
 * Scenario ④: v1 PFM memo wrapping v2 payload (intentional failure)
 * Osmosis(v1+PFM) → CosmosHub v2 emit attempt → Neutron
 * PFM cannot emit v2 packets — failure is expected; the failure data is the point
 * ──────────────────────────────────────────────────────────────────────────────
 */

function runScenario4(
  wallet: ReturnType<typeof useIbcTestWallet>,
  amount: string
): Promise<{ transactionHash: string }> {
  const v2PayloadAttempt = JSON.stringify({
    ibc_v2: {
      source_client: COSMOSHUB_CLIENT_FOR_NEUTRON,
      receiver: wallet.addresses.neutron,
    },
  })

  const pfmMemo = JSON.stringify({
    forward: {
      receiver: wallet.addresses.cosmoshub,
      port: 'transfer',
      channel: COSMOSHUB_TO_NEUTRON_CHANNEL,
      timeout: '10m',
      retries: 0,
      next: v2PayloadAttempt,
    },
  })

  const msg: EncodeObject = {
    typeUrl: '/ibc.applications.transfer.v1.MsgTransfer',
    value: MsgTransfer.fromPartial({
      sourcePort: 'transfer',
      sourceChannel: OSMO_TO_COSMOSHUB_CHANNEL,
      token: { denom: 'uosmo', amount },
      sender: wallet.addresses.osmosis,
      receiver: wallet.addresses.cosmoshub,
      memo: pfmMemo,
      timeoutTimestamp: timeoutTimestamp(),
    }),
  }
  return wallet.sendTx('osmosis', [msg])
}

/*
 * ──────────────────────────────────────────────────────────────────────────────
 * Scenario ⑤: v2 → v2 chained transfer
 * CosmosHub(v2) → Neutron, uatom
 * ──────────────────────────────────────────────────────────────────────────────
 */

async function runScenario5(
  wallet: ReturnType<typeof useIbcTestWallet>,
  amount: string
): Promise<{ transactionHash: string }> {
  const { buildV2TransferMsg, createV2Registry } = await import('ics20/v2-msg')
  const msg = buildV2TransferMsg({
    sourceClient: COSMOSHUB_CLIENT_FOR_NEUTRON,
    sender: wallet.addresses.cosmoshub,
    receiver: wallet.addresses.neutron,
    denom: 'uatom',
    amount,
  })
  return wallet.sendTx('cosmoshub', [msg], createV2Registry())
}

/*
 * ──────────────────────────────────────────────────────────────────────────────
 * Scenario ⑥: v2 → v2 → v2 (3-hop) experiment
 * CosmosHub(v2) → Neutron(v2) → Babylon, uatom
 * Requires callbacks middleware on Neutron to trigger onward v2 send.
 * Without it: source succeeds, Neutron receives and stops (ack success but no further hop).
 * ──────────────────────────────────────────────────────────────────────────────
 */

async function runScenario6(
  wallet: ReturnType<typeof useIbcTestWallet>,
  amount: string
): Promise<{ transactionHash: string }> {
  const { buildV2TransferMsg, createV2Registry } = await import('ics20/v2-msg')

  /*
   * Attempt to embed next-hop intent in memo.
   * Whether Neutron's ibc-go v10 callbacks middleware picks this up is the experiment.
   * NEUTRON_CLIENT_FOR_BABYLON is TBD — fill in once confirmed via RPC.
   */
  const NEUTRON_CLIENT_FOR_BABYLON_TBD = '07-tendermint-TBD'
  const nextHopMemo = JSON.stringify({
    ibc_callback: {
      next_v2_send: {
        source_client: NEUTRON_CLIENT_FOR_BABYLON_TBD,
        receiver: wallet.addresses.babylon,
        amount,
      },
    },
  })

  const msg = buildV2TransferMsg({
    sourceClient: COSMOSHUB_CLIENT_FOR_NEUTRON,
    sender: wallet.addresses.cosmoshub,
    receiver: wallet.addresses.neutron,
    denom: 'uatom',
    amount,
    memo: nextHopMemo,
  })
  return wallet.sendTx('cosmoshub', [msg], createV2Registry())
}

/*
 * ──────────────────────────────────────────────────────────────────────────────
 * Exported scenario list
 * ──────────────────────────────────────────────────────────────────────────────
 */

export const SCENARIOS: Scenario[] = [
  {
    id: 1,
    title: 'v1 ICS-20 simple transfer',
    route: 'Osmosis → Neutron',
    token: 'uosmo',
    description: 'Simple IBC v1 transfer to your own address.',
    sourceChainId: 'osmosis-1',
    run: runScenario1,
  },
  {
    id: 2,
    title: 'v1 + classic PFM (multi-hop v1→v1)',
    route: 'Osmosis → CosmosHub (PFM) → Neutron',
    token: 'uosmo',
    description: 'PFM memo {forward:{...}} style multi-hop.',
    sourceChainId: 'osmosis-1',
    run: runScenario2,
  },
  {
    id: 3,
    title: 'v2 MsgSendPacket → v1 arrival experiment',
    route: 'Neutron (v2 client=07-tendermint-0) → CosmosHub',
    token: 'untrn',
    description: 'v2 MsgSendPacket sent to a v1-arriving CosmosHub address.',
    sourceChainId: 'neutron-1',
    run: runScenario3,
  },
  {
    id: 4,
    title: 'v1 PFM memo wrapping v2 payload (intentional failure)',
    route: 'Osmosis (v1+PFM) → CosmosHub (v2 emit attempt) → Neutron',
    token: 'uosmo',
    description:
      'Expected to fail — PFM cannot decode v2. The failure data is the point.',
    sourceChainId: 'osmosis-1',
    run: runScenario4,
  },
  {
    id: 5,
    title: 'v2 → v2 chained transfer',
    route: 'CosmosHub (v2 client=07-tendermint-1119) → Neutron',
    token: 'uatom',
    description: 'Chained v2 hops via Eureka.',
    sourceChainId: 'cosmoshub-4',
    run: runScenario5,
  },
  {
    id: 6,
    title: 'v2 → v2 → v2 3-hop experiment',
    route: 'CosmosHub → Neutron → Babylon',
    token: 'uatom',
    description:
      'Depends on ibc-go v10 callbacks middleware on Neutron. Babylon client ID is TBD — scenario intentionally incomplete.',
    sourceChainId: 'cosmoshub-4',
    run: runScenario6,
  },
]
