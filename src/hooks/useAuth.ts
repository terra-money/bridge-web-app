import { useRecoilState, useSetRecoilState } from 'recoil'
import _ from 'lodash'

import { NETWORK } from 'consts'

import SendStore from 'store/SendStore'
import AuthStore, { initLoginUser } from 'store/AuthStore'
import NetworkStore from 'store/NetworkStore'

import terraService from 'services/terraService'

import { User } from 'types/auth'
import {
  BlockChainType,
  LocalTerraNetwork,
  isIbcNetwork,
  BridgeType,
} from 'types/network'
import { WalletEnum } from 'types/wallet'
import SendProcessStore, { ProcessStatus } from 'store/SendProcessStore'
import useTerraNetwork from './useTerraNetwork'
import metaMaskService from 'services/metaMaskService'

const useAuth = (): {
  login: ({ user }: { user: User }) => Promise<void>
  logout: () => void
  getLoginStorage: () => {
    lastFromBlockChain?: BlockChainType
    lastToBlockChain?: BlockChainType
    lastWalletType?: WalletEnum
    bridgeUsed?: BridgeType | undefined
  }
  setLoginStorage: (props?: {
    blockChain: BlockChainType
    walletType: WalletEnum
  }) => void
  setBlockchainStorage: (props: {
    fromBlockChain: BlockChainType
    toBlockChain: BlockChainType
    bridgeUsed: BridgeType | undefined
  }) => void
} => {
  const { getTerraNetworkByChainID, getTerraNetworkByWalletconnectID } =
    useTerraNetwork()

  const setLoginUser = useSetRecoilState(AuthStore.loginUser)
  const setEtherBaseExt = useSetRecoilState(NetworkStore.etherBaseExt)
  const setKeplrBaseExt = useSetRecoilState(NetworkStore.keplrExt)
  const setTerraExt = useSetRecoilState(NetworkStore.terraExt)
  const setTerraLocal = useSetRecoilState(NetworkStore.terraLocal)
  const setIsVisibleNotSupportNetworkModal = useSetRecoilState(
    NetworkStore.isVisibleNotSupportNetworkModal
  )
  const setTriedNotSupportNetwork = useSetRecoilState(
    NetworkStore.triedNotSupportNetwork
  )

  const [fromBlockChain, setFromBlockChain] = useRecoilState(
    SendStore.fromBlockChain
  )
  const setStatus = useSetRecoilState(SendProcessStore.sendProcessStatus)

  const login = async ({ user }: { user: User }): Promise<void> => {
    if (fromBlockChain === BlockChainType.terra) {
      let localNetwork: LocalTerraNetwork | undefined
      let name = ''
      let chainId: string | number = ''
      if (user.walletType === WalletEnum.TerraWalletConnect) {
        const walletConneceId = user.terraWalletConnect?.chainId
        chainId = walletConneceId || ''
        localNetwork = _.isNumber(walletConneceId)
          ? getTerraNetworkByWalletconnectID(walletConneceId)
          : undefined
        setTerraExt(localNetwork)
      } else {
        const extNet = await terraService.info()
        name = extNet.name
        chainId = extNet.chainID
        setTerraExt(extNet)
        localNetwork = getTerraNetworkByChainID(chainId)
      }

      if (!localNetwork) {
        setIsVisibleNotSupportNetworkModal(true)
        setTriedNotSupportNetwork({
          blockChain: BlockChainType.terra,
          name,
          chainId,
        })
        return
      }

      setTerraLocal(localNetwork)
      setLoginStorage({
        blockChain: BlockChainType.terra,
        walletType: user.walletType,
      })
    } else if (isIbcNetwork(fromBlockChain)) {
      const network = await user.signer?.getChainId()
      //const isIbcValidNetwork = ibcChainId[fromBlockChain as IbcNetwork] === network
      if (network) {
        setFromBlockChain(fromBlockChain)
        setKeplrBaseExt({
          chainID: (await user.signer?.getChainId()) || '',
          name: NETWORK.blockChainName[fromBlockChain],
        })
        setLoginStorage({
          blockChain: fromBlockChain,
          walletType: user.walletType,
        })
      } else {
        setIsVisibleNotSupportNetworkModal(true)
        network &&
          setTriedNotSupportNetwork({
            blockChain: BlockChainType.osmo,
            name: network,
            chainId: network,
          })
        return
      }
    }
    // ethereum, bsc, hmy are ethereum base blockchain
    else {
      const network = await user.provider?.getNetwork()
      if (network) {
        const { ETH_CHAINID } = NETWORK
        try {
          await metaMaskService.switchNetwork(fromBlockChain)
          setEtherBaseExt(network)
          setLoginStorage({
            blockChain: fromBlockChain,
            walletType: user.walletType,
          })
        } catch (e) {
          console.log(e)
          let reSelectFromBlockChain: BlockChainType
          if (
            [ETH_CHAINID.ETH_MAIN, ETH_CHAINID.ETH_ROPSTEN].includes(
              network.chainId
            )
          ) {
            reSelectFromBlockChain = BlockChainType.ethereum
          } else if (
            [ETH_CHAINID.HMY_MAIN, ETH_CHAINID.HMY_TEST].includes(
              network.chainId
            )
          ) {
            reSelectFromBlockChain = BlockChainType.hmy
          } else if (
            [ETH_CHAINID.BSC_MAIN, ETH_CHAINID.BSC_TEST].includes(
              network.chainId
            )
          ) {
            reSelectFromBlockChain = BlockChainType.bsc
          } else if (network.chainId === ETH_CHAINID.AVAX_MAIN) {
            reSelectFromBlockChain = BlockChainType.avalanche
          } else if (network.chainId === ETH_CHAINID.FTM_MAIN) {
            reSelectFromBlockChain = BlockChainType.fantom
          } else if (network.chainId === ETH_CHAINID.POLY_MAIN) {
            reSelectFromBlockChain = BlockChainType.polygon
          } else if (network.chainId === ETH_CHAINID.MOON_MAIN) {
            reSelectFromBlockChain = BlockChainType.moonbeam
          } else {
            setIsVisibleNotSupportNetworkModal(true)
            setTriedNotSupportNetwork({
              blockChain: BlockChainType.ethereum,
              name: network.name,
              chainId: network.chainId,
            })
            return
          }

          setFromBlockChain(reSelectFromBlockChain)
          setEtherBaseExt(network)

          setLoginStorage({
            blockChain: reSelectFromBlockChain,
            walletType: user.walletType,
          })
        }
      } else {
        setIsVisibleNotSupportNetworkModal(true)
        return
      }
    }
    // DON'T MOVE
    // set user have to be after set network info
    setLoginUser(user)
  }

  enum LocalStorageKey {
    lastFromBlockChain = 'lastFromBlockChain',
    lastToBlockChain = 'lastToBlockChain',
    lastWalletType = 'lastWalletType',
    bridgeUsed = 'bridgeUsed',
  }

  const setLoginStorage = (props?: {
    blockChain: BlockChainType
    walletType: WalletEnum
  }): void => {
    localStorage.setItem(
      LocalStorageKey.lastFromBlockChain,
      props?.blockChain || ''
    )
    localStorage.setItem(
      LocalStorageKey.lastWalletType,
      props?.walletType || ''
    )
  }

  const setBlockchainStorage = (props: {
    fromBlockChain: BlockChainType
    toBlockChain: BlockChainType
    bridgeUsed: BridgeType | undefined
  }): void => {
    localStorage.setItem(
      LocalStorageKey.lastFromBlockChain,
      props.fromBlockChain
    )
    localStorage.setItem(LocalStorageKey.lastToBlockChain, props.toBlockChain)
    localStorage.setItem(LocalStorageKey.bridgeUsed, props.bridgeUsed || '')
  }

  const getLoginStorage = (): {
    lastFromBlockChain?: BlockChainType
    lastToBlockChain?: BlockChainType
    bridgeUsed?: BridgeType
    lastWalletType?: WalletEnum
  } => {
    return {
      lastFromBlockChain: localStorage.getItem(
        LocalStorageKey.lastFromBlockChain
      ) as BlockChainType,
      lastToBlockChain: localStorage.getItem(
        LocalStorageKey.lastToBlockChain
      ) as BlockChainType,
      bridgeUsed: (localStorage.getItem(LocalStorageKey.bridgeUsed) ||
        undefined) as BridgeType | undefined,
      lastWalletType: localStorage.getItem(
        LocalStorageKey.lastWalletType
      ) as WalletEnum,
    }
  }

  const logout = (): void => {
    setLoginUser((user) => {
      user.terraWalletConnect?.killSession()
      return initLoginUser
    })
    setStatus(ProcessStatus.Input)
    setEtherBaseExt(undefined)
    setTerraExt(undefined)
    setLoginStorage()
  }

  return {
    login,
    logout,
    getLoginStorage,
    setLoginStorage,
    setBlockchainStorage,
  }
}

export default useAuth
