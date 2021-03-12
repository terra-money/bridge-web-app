import _ from 'lodash'
import BigNumber from 'bignumber.js'
import { useRecoilValue } from 'recoil'

import { ASSET, UTIL } from 'consts'

import { AssetNativeDenomEnum } from 'types/asset'

import ShuttleStore, {
  MAssetTerraPairContractAddressType,
} from 'store/ShuttleStore'

import useMantle from './useMantle'

const OracleDenomsExchangeRates = `
query {
    OracleDenomsExchangeRates {
      Height
      Result {
        Amount
        Denom
      }
    }
  }
  `

const getTerraMAssetPairContract = (
  addressList: MAssetTerraPairContractAddressType[]
): string => {
  const mapped = _.map(
    addressList,
    (item) =>
      `${item.tokenAddress}: WasmContractsContractAddressStore(
            ContractAddress: "${item.pairContractAddress}"
            QueryMsg: "{\\"pool\\":{}}"
        ) {
            Height
            Result
        }`
  )

  return `
  query {
    ${mapped}
  }
`
}

interface AssetToken {
  amount: string
  info: {
    token: { contract_addr: string }
  }
}

interface NativeToken {
  amount: string
  info: {
    native_token: { denom: string }
  }
}

const useShuttle = (): {
  getTerraShuttleFee: ({
    denom,
    amount,
  }: {
    denom: string
    amount: BigNumber
  }) => Promise<BigNumber>
} => {
  const { fetchQuery } = useMantle()
  const mAssetTerraPairContractAddress = useRecoilValue(
    ShuttleStore.mAssetTerraPairContractAddress
  )

  const getTerraDenomShuttleFee = async ({
    denom,
    amount,
  }: {
    denom: string
    amount: BigNumber
  }): Promise<BigNumber> => {
    const minUst = new BigNumber(ASSET.TERRA_DECIMAL)
    const zeroDotOnePerAmount = amount.times(0.001)

    if (denom === AssetNativeDenomEnum.uusd) {
      return zeroDotOnePerAmount.isGreaterThan(minUst)
        ? zeroDotOnePerAmount
        : minUst
    }

    const fetchResult = await fetchQuery({
      query: OracleDenomsExchangeRates,
    })

    const denomLunaPriceList: {
      Amount: string
      Denom: string
    }[] = fetchResult?.OracleDenomsExchangeRates.Result || []

    if (_.some(denomLunaPriceList)) {
      const uusdLunaPrice = new BigNumber(
        denomLunaPriceList.find((x) => x.Denom === AssetNativeDenomEnum.uusd)
          ?.Amount || 1
      )
      const targetLunaPrice =
        denom === AssetNativeDenomEnum.uluna
          ? new BigNumber(1)
          : new BigNumber(
              denomLunaPriceList.find((x) => x.Denom === denom)?.Amount || 1
            )
      const oneUstValueTargetPrice = targetLunaPrice
        .div(uusdLunaPrice)
        .times(ASSET.TERRA_DECIMAL)
        .dp(0)

      return zeroDotOnePerAmount.isGreaterThan(oneUstValueTargetPrice)
        ? zeroDotOnePerAmount
        : oneUstValueTargetPrice
    }
    return new BigNumber(0)
  }

  const getTerraMAssetShuttleFee = async ({
    contractAddress,
    amount,
  }: {
    contractAddress: string
    amount: BigNumber
  }): Promise<BigNumber> => {
    const query = getTerraMAssetPairContract(mAssetTerraPairContractAddress)
    const zeroDotOnePerAmount = amount.times(0.001)

    const fetchResult: Record<
      string,
      {
        Result: string
      }
    > = await fetchQuery({
      query,
    })

    const assets =
      (fetchResult &&
        UTIL.jsonTryParse<{ assets: (NativeToken | AssetToken)[] }>(
          fetchResult[contractAddress].Result
        )?.assets) ||
      []

    if (_.some(assets)) {
      const uusd = new BigNumber(
        assets.find(({ info }) => 'native_token' in info)?.amount ?? '1'
      )
      const token = new BigNumber(
        assets.find(({ info }) => 'token' in info)?.amount ?? '0'
      )

      const oneUstValueTargetPrice = token
        .div(uusd)
        .times(ASSET.TERRA_DECIMAL)
        .dp(0)

      return zeroDotOnePerAmount.isGreaterThan(oneUstValueTargetPrice)
        ? zeroDotOnePerAmount
        : oneUstValueTargetPrice
    }
    return new BigNumber(0)
  }

  // at least 1*
  const getTerraShuttleFee = async ({
    denom,
    amount,
  }: {
    denom: string
    amount: BigNumber
  }): Promise<BigNumber> => {
    return UTIL.isNativeDenom(denom)
      ? getTerraDenomShuttleFee({ denom, amount })
      : getTerraMAssetShuttleFee({ contractAddress: denom, amount })
  }

  return {
    getTerraShuttleFee,
  }
}

export default useShuttle
