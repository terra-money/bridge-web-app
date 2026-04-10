import { ReactElement, useState } from 'react'
import ClickAwayListener from 'react-click-away-listener'

import { UTIL } from 'consts'
import { View, Row, Text } from 'components'
import WalletLogo from 'components/WalletLogo'
import { WalletEnum } from 'types/wallet'

const WalletBadge = ({
  label,
  walletEnum,
  address,
  onConnect,
  onDisconnect,
}: {
  label: string
  walletEnum: WalletEnum
  address: string | null
  onConnect: () => void
  onDisconnect: () => void
}): ReactElement => {
  const [isOpen, setIsOpen] = useState(false)

  if (!address) {
    return (
      <button
        className="flex items-center justify-center gap-3 rounded-[14px] border border-white/20 text-lg py-3.5 px-6 min-w-[200px] cursor-pointer hover:border-bridge-sky hover:bg-white/5 bg-transparent text-white/60 transition-colors"
        onClick={onConnect}
      >
        <WalletLogo walleEnum={walletEnum} size={26} />
        <span>{label}</span>
      </button>
    )
  }

  return (
    <ClickAwayListener onClickAway={(): void => setIsOpen(false)}>
      <View className="relative">
        <Row
          className="items-center justify-center rounded-[14px] border border-bridge-sky text-lg py-3.5 px-6 min-w-[200px] cursor-pointer hover:opacity-80 gap-3"
          onClick={(): void => setIsOpen(!isOpen)}
        >
          <WalletLogo walleEnum={walletEnum} size={26} />
          <Text className="text-lg font-normal tracking-[-0.19px]">
            {UTIL.truncate(address, [6, 4])}
          </Text>
        </Row>

        {isOpen && (
          <View className="absolute cursor-pointer bottom-0 h-9 -mb-[38px] justify-center bg-[#484848] rounded-[10px] w-full p-0 text-center hover:bg-[#494f5a] z-[1] animate-[dropdown_0.3s_ease] text-xs">
            <View
              onClick={(): void => {
                onDisconnect()
                setIsOpen(false)
              }}
            >
              Disconnect
            </View>
          </View>
        )}
      </View>
    </ClickAwayListener>
  )
}

export default WalletBadge
