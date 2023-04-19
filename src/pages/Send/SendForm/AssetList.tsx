import { ReactElement, useEffect, useRef, useState } from 'react'
import _ from 'lodash'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import styled from 'styled-components'
import { CaretDownFill } from 'react-bootstrap-icons'

import { COLOR, STYLE } from 'consts'

import { AssetType } from 'types/asset'

import { Text, View, Row } from 'components'
import DefaultModal from 'components/Modal'
import FormInput from 'components/FormInput'
import FormImage from 'components/FormImage'

import useAsset from 'hooks/useAsset'
import AuthStore from 'store/AuthStore'
import SendStore from 'store/SendStore'

import { InfoElement } from './WarningInfo'
import { BlockChainType } from 'types'

const StyledContainer = styled.div`
  padding: 0 25px 40px;
  background-color: ${COLOR.darkGray2};
  @media ${STYLE.media.mobile} {
    padding: 0 24px 20px;
  }
`
const StyledAssetItemBox = styled.div`
  padding: 0;
  height: 500px;
  max-height: 60vh;
  overflow-y: scroll;
  background-color: ${COLOR.darkGray};
  border-radius: ${STYLE.css.borderRadius};
  ::-webkit-scrollbar {
    background-color: #202020;
    width: 16px;
  }
  ::-webkit-scrollbar-track {
    background-color: #202020;
  }
  ::-webkit-scrollbar-thumb {
    background-color: #171717;
    border-radius: 16px;
    border: 4px solid #202020;
  }
  ::-webkit-scrollbar-button {
    display: none;
  }
`

const StyledAssetItem = styled.div`
  position: relative;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  padding: 10px 20px;
  line-height: 16px;
  cursor: pointer;
  :hover {
    background-color: #171717;
  }
  :last-child {
    border-bottom: 0;
  }
`

const StyledSelectAssetButton = styled.div`
  cursor: pointer;
  border-bottom: 2px solid ${COLOR.darkGray2};
  padding: 12px 0 6px;
  font-size: 14px;
  font-weight: 500;
  :hover {
    opacity: 0.8;
  }
`

const StyledIconBox = styled(View)`
  flex: 0 0 8%;
  align-self: center;
  margin-top: 3px;
  margin-bottom: 3px;
  padding-right: 10px;
`

const AssetItem = ({
  asset,
  setShowModal,
  onChangeAmount,
}: {
  asset: AssetType
  setShowModal: (value: boolean) => void
  onChangeAmount: ({ value }: { value: string }) => void
}): ReactElement => {
  const [oriAsset, setAsset] = useRecoilState(SendStore.asset)
  const isLoggedIn = useRecoilValue(AuthStore.isLoggedIn)
  const fromBlockChain = useRecoilValue(SendStore.fromBlockChain)

  const { formatBalance } = useAsset()

  return (
    <StyledAssetItem
      onClick={(): void => {
        if (oriAsset !== asset) {
          onChangeAmount({ value: '' })
        }
        setAsset(asset)
        setShowModal(false)
      }}
    >
      <Row style={{ justifyContent: 'space-between' }}>
        <Row>
          <StyledIconBox>
            <FormImage src={asset.logoURI} size={20} />
          </StyledIconBox>
          <View>
            <Text style={{ fontSize: 14, fontWeight: 500 }}>
              {fromBlockChain === BlockChainType.ethereum
                ? asset.symbol.replace('axl', '')
                : asset.symbol}
            </Text>
            <Text style={{ color: COLOR.blueGray, fontSize: 12 }}>
              {fromBlockChain === BlockChainType.ethereum
                ? asset.name.replace('Axelar ', '')
                : asset.name}
            </Text>
          </View>
        </Row>
        {isLoggedIn && (
          <View style={{ justifyContent: 'center' }}>
            <Text style={{ fontSize: 14 }}>
              {asset.balance
                ? formatBalance(asset.balance, asset.terraToken)
                : '0'}{' '}
            </Text>
          </View>
        )}
      </Row>
    </StyledAssetItem>
  )
}

const SelectAssetButton = ({
  asset,
  setShowModal,
}: {
  asset?: AssetType
  setShowModal: (value: boolean) => void
}): ReactElement => {
  const { formatBalance } = useAsset()
  const isLoggedIn = useRecoilValue(AuthStore.isLoggedIn)
  const fromBlockChain = useRecoilValue(SendStore.fromBlockChain)

  return (
    <StyledSelectAssetButton
      onClick={(): void => {
        setShowModal(true)
      }}
    >
      {asset && (
        <Row>
          <Row style={{ flex: 1, alignItems: 'center' }}>
            <FormImage
              src={asset.logoURI}
              size={18}
              style={{ marginTop: -2 }}
            />
            <Text style={{ marginLeft: 10, fontSize: 16 }}>
              {fromBlockChain === BlockChainType.ethereum
                ? asset.symbol.replace('axl', '')
                : asset.symbol}
            </Text>
          </Row>
          <Row style={{ alignItems: 'center' }}>
            {isLoggedIn && (
              <Text
                style={{
                  justifyContent: 'flex-end',
                  marginRight: 10,
                  fontWeight: 'normal',
                  color: '#A3A3A3',
                }}
              >
                Available{' '}
                {asset.balance
                  ? formatBalance(asset.balance, asset.terraToken)
                  : '0'}
              </Text>
            )}
            <CaretDownFill style={{ fontSize: 8, marginTop: -2 }} />
          </Row>
        </Row>
      )}
    </StyledSelectAssetButton>
  )
}

const AssetList = ({
  selectedAsset,
  onChangeAmount,
}: {
  selectedAsset?: AssetType
  onChangeAmount: ({ value }: { value: string }) => void
}): ReactElement => {
  const scrollRef = useRef<HTMLDivElement>(null)

  const assetList = useRecoilValue(SendStore.loginUserAssetList)
  const setAsset = useSetRecoilState(SendStore.asset)
  const [showModal, setShowModal] = useState(false)
  const [inputFilter, setInputFilter] = useState('')

  const filteredAssetList = assetList.filter((x) => {
    const inputFilterLower = inputFilter.toLowerCase()
    return inputFilterLower
      ? x.name.toLowerCase().includes(inputFilterLower) ||
          x.symbol.toLowerCase().includes(inputFilterLower)
      : true
  })
  // console.log('assetlist',assetList);

  useEffect(() => {
    if (showModal) {
      setInputFilter('')
      scrollRef.current?.scrollTo({ top: 200, behavior: 'smooth' })
    }
  }, [showModal])

  useEffect(() => {
    if (_.some(assetList)) {
      if (selectedAsset) {
        setAsset(
          assetList.find((x) => x.terraToken === selectedAsset.terraToken) ||
            assetList[0]
        )
      } else {
        setAsset(assetList[0])
      }
    }
  }, [assetList])

  return (
    <>
      <SelectAssetButton asset={selectedAsset} setShowModal={setShowModal} />
      <DefaultModal
        {...{
          isOpen: showModal,
          close: (): void => {
            setShowModal(false)
          },
        }}
        header={<Text style={{ justifyContent: 'center' }}>Select Asset</Text>}
      >
        <StyledContainer>
          <div
            style={{
              marginBottom: 25,
              border: 'solid 1px rgba(255,255,255,.15)',
              borderRadius: 10,
              overflow: 'hidden',
            }}
          >
            <FormInput
              onChange={({ currentTarget: { value } }): void => {
                setInputFilter(value)
              }}
              maxLength={30}
              placeholder={'Search'}
              style={{ marginLeft: 24 }}
            />
          </div>

          <StyledAssetItemBox
            ref={scrollRef}
            onLoad={(): void => {
              const index = selectedAsset
                ? filteredAssetList.indexOf(selectedAsset)
                : 0
              scrollRef.current?.scrollTo({
                top: index * 45,
                behavior: 'smooth',
              })
            }}
          >
            {_.some(filteredAssetList) ? (
              _.map(filteredAssetList, (asset, index) => (
                <AssetItem
                  key={`asset-${index}`}
                  asset={asset}
                  setShowModal={setShowModal}
                  onChangeAmount={onChangeAmount}
                />
              ))
            ) : (
              <Text style={{ padding: 20, fontSize: 14 }}>
                {inputFilter
                  ? `"${inputFilter}" does not exist`
                  : 'AssetList is empty'}{' '}
              </Text>
            )}
            <InfoElement
              style={{ marginLeft: 16, marginTop: 26, padding: '10px 20px' }}
            >
              If you can't find your asset try to switch chain or bridge used
            </InfoElement>
          </StyledAssetItemBox>
        </StyledContainer>
      </DefaultModal>
    </>
  )
}

export default AssetList
