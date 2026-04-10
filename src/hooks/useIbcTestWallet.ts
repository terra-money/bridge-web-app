/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback } from 'react'
import { EncodeObject, OfflineSigner, Registry } from '@cosmjs/proto-signing'
import { SigningStargateClient } from '@cosmjs/stargate'

import babylonInfo from 'chain-configs/babylon.json'
import cosmoshubInfo from 'chain-configs/cosmoshub.json'
import neutronInfo from 'chain-configs/neutron.json'
import osmosisInfo from 'chain-configs/osmosis.json'

export type ChainKey = 'osmosis' | 'neutron' | 'babylon' | 'cosmoshub'

type ChainInfo = typeof osmosisInfo

const CHAIN_INFOS: Record<ChainKey, ChainInfo> = {
  osmosis: osmosisInfo,
  neutron: neutronInfo,
  babylon: babylonInfo,
  cosmoshub: cosmoshubInfo,
}

const CHAIN_IDS: Record<ChainKey, string> = {
  osmosis: osmosisInfo.chainId,
  neutron: neutronInfo.chainId,
  babylon: babylonInfo.chainId,
  cosmoshub: cosmoshubInfo.chainId,
}

type Addresses = Record<ChainKey, string>

const EMPTY_ADDRESSES: Addresses = {
  osmosis: '',
  neutron: '',
  babylon: '',
  cosmoshub: '',
}

export function useIbcTestWallet() {
  const [connected, setConnected] = useState(false)
  const [addresses, setAddresses] = useState<Addresses>({ ...EMPTY_ADDRESSES })
  const [error, setError] = useState<string | null>(null)

  // Signers are kept in a ref-like mutable object outside React state
  // so sendTx can access them without stale closures
  const [signers] = useState<Record<ChainKey, OfflineSigner | null>>({
    osmosis: null,
    neutron: null,
    babylon: null,
    cosmoshub: null,
  })

  const connect = useCallback(async (): Promise<void> => {
    if (!window.keplr) {
      throw new Error('Keplr not installed')
    }

    // Suggest each chain to Keplr
    for (const key of Object.keys(CHAIN_INFOS) as ChainKey[]) {
      await window.keplr.experimentalSuggestChain(CHAIN_INFOS[key] as any)
    }

    // Enable all 4 chains at once
    await window.keplr.enable(Object.values(CHAIN_IDS))

    // Get signer and address per chain
    const newAddresses: Addresses = { ...EMPTY_ADDRESSES }
    for (const key of Object.keys(CHAIN_IDS) as ChainKey[]) {
      const chainId = CHAIN_IDS[key]

      /*
       * Prefer Direct signer (needed for v2 MsgSendPacket which has no Amino handler).
       * Fall back to Amino if Direct is unavailable.
       */
      let signer: OfflineSigner
      try {
        signer = window.keplr.getOfflineSigner(chainId)
      } catch {
        signer = window.getOfflineSignerOnlyAmino!(chainId)
      }

      signers[key] = signer
      newAddresses[key] = (await signer.getAccounts())[0].address
    }

    setAddresses(newAddresses)
    setConnected(true)
    setError(null)
  }, [signers])

  const disconnect = useCallback((): void => {
    for (const key of Object.keys(signers) as ChainKey[]) {
      signers[key] = null
    }
    setAddresses({ ...EMPTY_ADDRESSES })
    setConnected(false)
    setError(null)
  }, [signers])

  const sendTx = useCallback(
    async (
      chainKey: ChainKey,
      msgs: EncodeObject[],
      registryOverride?: Registry
    ): Promise<{ transactionHash: string }> => {
      const signer = signers[chainKey]
      if (!signer) {
        throw new Error(`Not connected to ${chainKey}`)
      }

      const chainInfo = CHAIN_INFOS[chainKey]
      const clientOptions = registryOverride
        ? { registry: registryOverride }
        : {}

      const client = await SigningStargateClient.connectWithSigner(
        chainInfo.rpc,
        signer,
        clientOptions
      )

      const addr = addresses[chainKey]
      const simulate = await client.simulate(addr, msgs, undefined)
      const gasLimit =
        simulate && simulate > 0 ? String(Math.ceil(simulate * 1.3)) : '500000'

      const result = await client.signAndBroadcast(addr, msgs, {
        amount: [
          {
            amount: String(Math.ceil(Number(gasLimit) * 0.025)),
            denom: chainInfo.feeCurrencies[0].coinMinimalDenom,
          },
        ],
        gas: gasLimit,
      })

      return result
    },
    [signers, addresses]
  )

  // Re-fetch addresses when Keplr keystore changes (e.g. account switch)
  useEffect(() => {
    const onKeystoreChange = (): void => {
      if (connected) {
        connect().catch(() => undefined)
      }
    }
    window.addEventListener('keplr_keystorechange', onKeystoreChange)
    return () =>
      window.removeEventListener('keplr_keystorechange', onKeystoreChange)
  }, [connected, connect])

  return { connected, addresses, error, connect, disconnect, sendTx }
}
