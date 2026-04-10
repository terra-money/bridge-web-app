import { ReactElement, useState } from 'react'

import { useIbcTestWallet } from 'hooks/useIbcTestWallet'
import { SCENARIOS } from 'ics20/test-scenarios'
import WalletBadge from 'components/WalletBadge'
import { WalletEnum } from 'types/wallet'

interface ScenarioResult {
  status: 'idle' | 'loading' | 'success' | 'error'
  hash?: string
  error?: string
}

const EXPLORER: Record<string, string> = {
  'osmosis-1': 'https://www.mintscan.io/osmosis/txs',
  'neutron-1': 'https://www.mintscan.io/neutron/txs',
  'bbn-1': 'https://www.mintscan.io/babylon/txs',
  'cosmoshub-4': 'https://www.mintscan.io/cosmos/txs',
  'atomone-1': 'https://www.mintscan.io/atomone/txs',
}

const IbcTestPage = (): ReactElement => {
  const wallet = useIbcTestWallet()
  const [amount, setAmount] = useState('1')
  const [connecting, setConnecting] = useState(false)
  const [results, setResults] = useState<Record<number, ScenarioResult>>(
    Object.fromEntries(
      SCENARIOS.map((s) => [s.id, { status: 'idle' as const }])
    )
  )

  const handleConnect = async (): Promise<void> => {
    setConnecting(true)
    try {
      await wallet.connect()
    } catch (e) {
      alert('Connection failed: ' + e)
    } finally {
      setConnecting(false)
    }
  }

  const runScenario = async (id: number): Promise<void> => {
    const scenario = SCENARIOS.find((s) => s.id === id)
    if (!scenario) return

    setResults((prev) => ({ ...prev, [id]: { status: 'loading' } }))
    try {
      const result = await scenario.run(wallet, amount)
      setResults((prev) => ({
        ...prev,
        [id]: { status: 'success', hash: result.transactionHash },
      }))
    } catch (e: unknown) {
      setResults((prev) => ({
        ...prev,
        [id]: { status: 'error', error: String(e) },
      }))
    }
  }

  const explorerUrl = (chainId: string, hash: string): string => {
    const base = EXPLORER[chainId] ?? 'https://www.mintscan.io'
    return `${base}/${hash}`
  }

  return (
    <div className="flex flex-col items-center gap-6 py-8 px-4">
      {/* Warning banner */}
      <div className="w-full max-w-2xl text-sm text-yellow-400 bg-yellow-400/10 border border-yellow-400/30 rounded-lg px-4 py-2">
        ⚠ Mainnet — real fees will be charged. Developer IBC experiment tool.
      </div>

      {/* Wallet connect */}
      <div className="bg-gray-800 rounded-lg p-6 shadow-lg w-full max-w-2xl">
        <h2 className="text-xl font-semibold mb-4 text-center text-white">
          IBC Test Console
        </h2>

        <div className="flex flex-col gap-4">
          <WalletBadge
            label={
              connecting
                ? 'Connecting...'
                : wallet.connected
                ? 'Reconnect Wallet'
                : 'Connect Wallet'
            }
            walletEnum={WalletEnum.Keplr}
            address={null}
            onConnect={handleConnect}
            onDisconnect={wallet.disconnect}
          />

          {wallet.connected && (
            <div className="flex flex-col gap-1 text-sm">
              {(
                [
                  ['osmosis', 'Osmosis'],
                  ['neutron', 'Neutron'],
                  ['babylon', 'Babylon'],
                  ['cosmoshub', 'Cosmos Hub'],
                ] as const
              ).map(([key, label]) => (
                <div key={key} className="flex items-center gap-2 min-w-0">
                  <span className="text-gray-400 shrink-0 w-24">{label}</span>
                  <span className="text-white font-mono truncate text-xs">
                    {wallet.addresses[key]}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Amount input (shared) */}
      <div className="bg-gray-800 rounded-lg p-4 shadow-lg w-full max-w-2xl">
        <div className="flex items-center gap-3">
          <label className="text-gray-400 text-sm shrink-0">
            Amount (shared)
          </label>
          <input
            type="number"
            value={amount}
            min={0}
            onChange={(e): void => setAmount(e.target.value)}
            placeholder="1"
            className="flex-1 bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-400"
          />
        </div>
      </div>

      {/* Scenario cards */}
      <div className="flex flex-col gap-4 w-full max-w-2xl">
        {SCENARIOS.map((scenario) => {
          const result = results[scenario.id]
          return (
            <div
              key={scenario.id}
              className="bg-gray-800 rounded-lg p-5 shadow-lg"
            >
              {/* Header row: title + Run button */}
              <div className="flex items-start justify-between gap-4 mb-2">
                <h3 className="text-base font-semibold text-white leading-snug">
                  {scenario.id}. {scenario.title}
                </h3>
                <button
                  className="shrink-0 px-4 py-1.5 rounded-md bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium transition-colors flex items-center gap-1.5"
                  disabled={!wallet.connected || result.status === 'loading'}
                  onClick={(): Promise<void> => runScenario(scenario.id)}
                >
                  {result.status === 'loading' ? (
                    <>
                      <span className="inline-block w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Running...
                    </>
                  ) : (
                    'Run'
                  )}
                </button>
              </div>

              {/* 3-line description */}
              <p className="text-xs text-gray-400 mb-0.5">
                Route: {scenario.route}
              </p>
              <p className="text-xs text-gray-400 mb-1.5">
                Token: {scenario.token}
              </p>
              <p className="text-sm text-gray-300 mb-3">
                {scenario.description}
              </p>

              {/* Success result */}
              {result.status === 'success' && (
                <div className="rounded-md bg-green-900/30 border border-green-500/40 px-3 py-2 text-sm">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-green-400 font-medium">
                      ✓ Success
                    </span>
                  </div>
                  <p className="font-mono text-white break-all text-xs mb-1">
                    {result.hash}
                  </p>
                  <a
                    href={explorerUrl(scenario.sourceChainId, result.hash!)}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-400 hover:underline inline-block"
                  >
                    View on Mintscan →
                  </a>
                </div>
              )}

              {/* Error result */}
              {result.status === 'error' && (
                <div className="rounded-md bg-red-900/30 border border-red-500/40 px-3 py-2 text-sm">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-red-400 font-medium">✗ Error</span>
                  </div>
                  <p className="text-gray-300 break-all text-xs">
                    {result.error}
                  </p>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default IbcTestPage
