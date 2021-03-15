import { ReactElement, useEffect, useRef, useState } from 'react'
import _ from 'lodash'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import styled from 'styled-components'
import { Col, Row } from 'react-bootstrap'
import { ChevronRight } from 'react-bootstrap-icons'

import { COLOR, STYLE } from 'consts'

import { AssetType } from 'types/asset'

import { Text } from 'components'
import DefaultModal from 'components/Modal'
import FormInput from 'components/FormInput'

import useAsset from 'hooks/useAsset'
import AuthStore from 'store/AuthStore'
import SendStore from 'store/SendStore'
import FormImage from 'components/FormImage'

const StyledContainer = styled.div`
  padding: 20px 30px;
  background-color: ${COLOR.darkGray2};
`

const StyledAssetItemBox = styled.div`
  padding: 5px 0;
  height: 500px;
  max-height: 60vh;
  overflow-y: scroll;
  background-color: ${COLOR.darkGray};
  border-radius: ${STYLE.css.borderRadius};
`

const StyledAssetItem = styled.div`
  position: relative;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  padding: 10px 20px;
  line-height: 16px;
  cursor: pointer;
  :hover {
    opacity: 0.8;
  }
  :last-child {
    border-bottom: 0;
  }
`

const StyledSelectAssetButton = styled.div`
  cursor: pointer;
  border-width: 1px;
  border-color: ${COLOR.red};
  border-radius: ${STYLE.css.borderRadius};
  padding: 10px 15px;
  font-size: 14px;
  font-weight: 500;
  background-color: ${COLOR.darkGray2};
  :hover {
    opacity: 0.8;
  }
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
  const { formatBalance } = useAsset()
  const isLoggedIn = useRecoilValue(AuthStore.isLoggedIn)

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
      <Row>
        <Col
          sm={1}
          style={{ alignSelf: 'center', marginTop: 3, marginBottom: 3 }}
        >
          <FormImage src={asset.loguURI} size={20} />
        </Col>
        <Col>
          <Row>
            <Col>
              <Text style={{ fontSize: 14, fontWeight: 500 }}>
                {asset.symbol}
              </Text>
              <br />
            </Col>
          </Row>
          <Row>
            <Col>
              <Text style={{ color: COLOR.blueGray, fontSize: 12 }}>
                {asset.name}
              </Text>
            </Col>
          </Row>
        </Col>
        {isLoggedIn && (
          <Col style={{ textAlign: 'right', alignSelf: 'center' }}>
            <Text style={{ fontSize: 14 }}>
              {asset.balance ? formatBalance(asset.balance) : '0'}{' '}
            </Text>
          </Col>
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

  return (
    <StyledSelectAssetButton
      onClick={(): void => {
        setShowModal(true)
      }}
    >
      {asset && (
        <Row>
          <Col style={{ display: 'flex', alignItems: 'center' }}>
            <FormImage src={asset.loguURI} size={16} />
            <Text style={{ marginLeft: 10 }}>{asset.symbol}</Text>
          </Col>
          <Col style={{ textAlign: 'right' }}>
            {isLoggedIn && (
              <Text style={{ marginRight: 10, fontWeight: 400 }}>
                {asset.balance ? formatBalance(asset.balance) : '0'}
              </Text>
            )}
            <ChevronRight style={{ fontSize: 12, marginTop: -2 }} />
          </Col>
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

  const filteredAssetList = assetList.filter((x) =>
    inputFilter
      ? x.name.toLowerCase().includes(inputFilter) ||
        x.symbol.toLowerCase().includes(inputFilter)
      : true
  )

  useEffect(() => {
    if (showModal) {
      scrollRef.current?.scrollTo({ top: 200, behavior: 'smooth' })
    }
  }, [showModal])

  useEffect(() => {
    if (_.some(assetList)) {
      if (selectedAsset) {
        setAsset(
          assetList.find((x) => x.symbol === selectedAsset.symbol) ||
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
        header={<Text>Select Asset</Text>}
      >
        <StyledContainer>
          <div
            style={{
              marginBottom: 20,
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
                {`"${inputFilter}" does not exist`}{' '}
              </Text>
            )}
          </StyledAssetItemBox>
        </StyledContainer>
      </DefaultModal>
    </>
  )
}

export default AssetList
