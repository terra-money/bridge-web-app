import { ReactElement } from 'react'
import _ from 'lodash'
import styled from 'styled-components'
import { Dropdown, Tooltip, OverlayTrigger } from 'react-bootstrap'
import { CaretDownFill } from 'react-bootstrap-icons'
import NETWORK from '../consts/network'
import { COLOR } from 'consts'
import Text from './Text'
import { BlockChainType } from 'types'
import FormImage from 'components/FormImage'
import warningSvg from 'images/warning.svg'

type FormSelectProps<T> = {
  selectedValue: T
  optionList: {
    value: T
    label: string
    isDisabled?: boolean
    warning?: string
  }[]
  onSelect: (value: T) => void
  size?: 'sm' | 'lg'
  containerStyle?: React.CSSProperties
  menuContainerStyle?: React.CSSProperties
  selectedTextStyle?: React.CSSProperties
  itemStyle?: React.CSSProperties
  icons?: boolean
}

const StyledDropdown = styled(Dropdown)`
  position: relative;
`

const StyledDropdownItem = styled(StyledDropdown.Item)`
  border-top: solid 1px #292929;
  padding: 13px 12px 12px 15px;
  font-size: 13px;
  :hover {
    background-color: #323842;
  }
  :first-child {
    border-top: 0;
  }
  @media only screen and (max-width: 450px) {
    font-size: 10px;
    padding: 10px 9px 9px 12px;
  }
`

const StyledDropdownToggle = styled(StyledDropdown.Toggle)`
  cursor: pointer;
  height: 100%;
  padding: 13px 12px 12px 15px;
  border-width: 0;
  border-radius: 10px;
  box-shadow: 0 12px 7px -7px rgba(0, 0, 0, 0.34);
  background-color: ${COLOR.darkGray2};
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: -0.25px;
  color: #e9e9e9;

  ::after {
    display: none;
  }
  :hover {
    background-color: #323842;
  }
  :focus {
    box-shadow: none !important;
    outline: none;
  }

  @media only screen and (max-width: 450px) {
    font-size: 10px;
    padding: 10px 9px 9px 12px;
  }
`

const StyledDropdownMenu = styled(StyledDropdown.Menu)`
  z-index: 1;
  background-color: ${COLOR.darkGray};
  margin-top: 5;
  border: 0;
  width: 100%;
  padding: 0;
  border-radius: 10px;
  box-shadow: 0 12px 7px -7px rgba(0, 0, 0, 0.34);
  background-color: #2e2e2e;
  transform: translate(0, 0) !important;
  a {
    display: block;
    color: ${COLOR.white};
    padding: 12px;
    font-size: 12px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: -0.25px;
    text-decoration: none;
    :hover {
      color: ${COLOR.white};
      background-color: rgba(85, 146, 247, 0.1);
    }
  }

  @media only screen and (max-width: 450px) {
    a {
      font-size: 10px;
    }
  }
`

const BlockchainIcon = styled.img`
  display: inline;
  height: 18px;
  width: 18px;
  object-fit: contain;
`

const FormSelect = <T,>({
  selectedValue,
  optionList,
  onSelect,
  size,
  containerStyle,
  menuContainerStyle,
  selectedTextStyle,
  itemStyle,
  icons,
}: FormSelectProps<T>): ReactElement => {
  return (
    <StyledDropdown>
      <StyledDropdownToggle
        variant="secondary"
        size={size}
        style={containerStyle}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {icons && (
            <BlockchainIcon
              src={
                NETWORK.blockChainImage[
                  optionList.find((x) => x.value === selectedValue)
                    ?.value as any as BlockChainType
                ]
              }
              alt="Blockchain Icon"
            />
          )}

          <Text
            style={{
              ...selectedTextStyle,
              marginLeft: icons ? 8 : 0,
              fontWeight: 500,
              lineHeight: 1.5,
            }}
          >
            {optionList.find((x) => x.value === selectedValue)?.label}
          </Text>
        </div>
        <CaretDownFill style={{ fontSize: 9, paddingLeft: 6 }} />
      </StyledDropdownToggle>
      <StyledDropdownMenu style={menuContainerStyle}>
        {_.map(optionList, (option, i) => (
          <StyledDropdownItem
            style={{
              ...itemStyle,
              borderTopLeftRadius: i === 0 ? '10px' : '0',
              borderTopRightRadius: i === 0 ? '10px' : '0',
              borderBottomLeftRadius:
                i === optionList.length - 1 ? '10px' : '0',
              borderBottomRightRadius:
                i === optionList.length - 1 ? '10px' : '0',
            }}
            key={`option-${i}`}
            onClick={(): void => {
              if (option.isDisabled) {
                return
              }
              onSelect(option.value)
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {icons && (
                <BlockchainIcon
                  src={
                    NETWORK.blockChainImage[
                      option.value as any as BlockChainType
                    ]
                  }
                  alt="Blockchain Icon"
                  style={{ opacity: option.isDisabled ? 0.8 : 1 }}
                />
              )}
              <>
                <Text
                  style={{
                    ...selectedTextStyle,
                    marginLeft: icons ? 8 : 0,
                    marginRight: 4,
                    color: option.isDisabled
                      ? COLOR.blueGray
                      : icons
                      ? '#B9B9B9'
                      : COLOR.white,
                    fontWeight: 500,
                    lineHeight: 1.5,
                  }}
                >
                  {option.label}
                </Text>

                {option.warning && (
                  <OverlayTrigger
                    delay={{ hide: 150, show: 0 }}
                    overlay={
                      <Tooltip
                        id="shuttle-warning"
                        style={{
                          color: '#e0a44d',
                          backgroundColor: '#312a22',
                          border: '1px solid #433626',
                          padding: '10px',
                          borderRadius: '5px',
                          fontSize: '12px',
                          maxWidth: '150px',
                          marginLeft: '10px',
                        }}
                      >
                        {option.warning}
                      </Tooltip>
                    }
                    placement="right"
                  >
                    <FormImage
                      src={warningSvg}
                      size={18}
                      style={{ marginLeft: '10px' }}
                    />
                  </OverlayTrigger>
                )}
              </>
            </div>
          </StyledDropdownItem>
        ))}
      </StyledDropdownMenu>
    </StyledDropdown>
  )
}

export default FormSelect
