import { atom } from 'recoil'

export type MAssetTerraPairContractAddressType = {
  tokenAddress: string //token address
  pairContractAddress: string // pair contract address
}

const mAssetTerraPairContractAddress = atom<
  MAssetTerraPairContractAddressType[]
>({
  key: 'mAssetTerraPairContractAddress',
  default: [],
})

export default {
  mAssetTerraPairContractAddress,
}
