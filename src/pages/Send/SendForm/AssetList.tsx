import { ReactElement, useEffect, useRef, useState } from 'react'
import _ from 'lodash'
import { useRecoilValue } from 'recoil'
import styled from 'styled-components'
import { Col, Row } from 'react-bootstrap'
import { Check, ChevronRight } from 'react-bootstrap-icons'

import { COLOR } from 'consts'

import { AssetType } from 'types/asset'

import { Text } from 'components'
import DefaultModal from 'components/Modal'
import FormInput from 'components/FormInput'

import useAsset from 'hooks/useAsset'
import AuthStore from 'store/AuthStore'
import SendStore from 'store/SendStore'

const StyledContainer = styled.div`
  padding: 20px 30px;
  background-color: ${COLOR.darkGray2};
`

const StyledAssetItemBox = styled.div`
  padding: 10px 0;
  height: 500px;
  overflow-y: scroll;
  background-color: ${COLOR.darkGray};
  border-radius: 15px;
`

const StyledAssetItem = styled.div`
  position: relative;
  border-bottom: 1px solid ${COLOR.blueGray};
  padding: 0 20px;
  cursor: pointer;
  :hover {
    opacity: 0.8;
  }
`

const StyledSelectAssetButton = styled.div`
  cursor: pointer;
  border-width: 1px;
  border-color: red;
  padding: 10px;
  background-color: ${COLOR.darkGray2};
  :hover {
    opacity: 0.8;
  }
`

const AssetItem = ({
  asset,
  selected,
  setSelectedAsset,
  setShowModal,
}: {
  asset: AssetType
  selected: boolean
  setSelectedAsset: (asset: AssetType) => void
  setShowModal: (value: boolean) => void
}): ReactElement => {
  const { formatBalace } = useAsset()
  const isLoggedIn = useRecoilValue(AuthStore.isLoggedIn)

  return (
    <StyledAssetItem
      onClick={(): void => {
        setSelectedAsset(asset)
        setShowModal(false)
      }}
    >
      {selected && (
        <div style={{ position: 'absolute', top: -5, left: 5 }}>
          <Check color={COLOR.orange} width={30} height={30} />
        </div>
      )}
      <Row>
        <Col sm={1} style={{ alignSelf: 'center' }}>
          <img src={asset.loguURI} alt="" width={24} height={24} />
        </Col>
        <Col>
          <Row>
            <Col>
              <Text>{asset.symbol}</Text>
            </Col>
          </Row>
          <Row>
            <Col>
              <Text style={{ color: COLOR.blueGray, fontSize: 14 }}>
                {asset.name}
              </Text>
            </Col>
          </Row>
        </Col>
        {isLoggedIn && (
          <Col style={{ textAlign: 'right', alignSelf: 'center' }}>
            <Text>{asset.balance ? formatBalace(asset.balance) : '0'} </Text>
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
  const { formatBalace } = useAsset()
  const isLoggedIn = useRecoilValue(AuthStore.isLoggedIn)

  return (
    <StyledSelectAssetButton
      onClick={(): void => {
        setShowModal(true)
      }}
    >
      {asset && (
        <Row>
          <Col sm={1}>
            <img src={asset.loguURI} alt="" width={24} height={24} />
          </Col>
          <Col>
            <Text>{asset.symbol}</Text>
          </Col>
          {isLoggedIn && (
            <Col style={{ textAlign: 'right' }}>
              <Text>{asset.balance ? formatBalace(asset.balance) : '0'}</Text>
            </Col>
          )}
          <Col xs={1} style={{ marginRight: 10 }}>
            <ChevronRight />
          </Col>
        </Row>
      )}
    </StyledSelectAssetButton>
  )
}

const AssetList = ({
  selectedAsset,
  setSelectedAsset,
}: {
  selectedAsset?: AssetType
  setSelectedAsset: (value: AssetType) => void
}): ReactElement => {
  const scrollRef = useRef<HTMLDivElement>(null)

  const assetList = useRecoilValue(SendStore.loginUserAssetList)
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
        setSelectedAsset(
          assetList.find((x) => x.symbol === selectedAsset.symbol) ||
            assetList[0]
        )
      } else {
        setSelectedAsset(assetList[0])
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
              padding: 20,
              marginBottom: 20,
              backgroundColor: COLOR.darkGray,
              borderRadius: 15,
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
                  selected={asset === selectedAsset}
                  setSelectedAsset={setSelectedAsset}
                  setShowModal={setShowModal}
                />
              ))
            ) : (
              <Text style={{ padding: 20 }}>
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
