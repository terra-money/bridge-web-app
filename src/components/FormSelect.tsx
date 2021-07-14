import { ReactElement } from 'react'
import _ from 'lodash'
import styled from 'styled-components'
import { Dropdown } from 'react-bootstrap'
import { CaretDownFill } from 'react-bootstrap-icons'

import { COLOR, STYLE } from 'consts'
import Text from './Text'

type FormSelectProps<T> = {
  selectedValue: T
  optionList: { value: T; label: string; isDisabled?: boolean }[]
  onSelect: (value: T) => void
  size?: 'sm' | 'lg'
  containerStyle?: React.CSSProperties
  menuContainerStyle?: React.CSSProperties
  selectedTextStyle?: React.CSSProperties
}

const StyledDropdown = styled(Dropdown)`
  position: relative;
`

const StyledDropdownItem = styled(StyledDropdown.Item)`
  border-top: solid 1px #292929;
  padding: 8px 10px;
  font-size: 13px;
  :hover {
    background-color: #323842;
  }
  :first-child {
    border-top: 0;
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
  font-size: 16px;
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
    background-color: #494e59;
  }
  :focus {
    box-shadow: none !important;
    outline: none;
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
  transform: translate(0px, 0px) !important;
  a {
    display: block;
    color: ${COLOR.white};
    padding: 12px;
    font-size: 16px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: -0.25px;
    border-radius: ${STYLE.css.borderRadius};
    text-decoration: none;
    :hover {
      color: ${COLOR.white};
      background-color: rgba(85, 146, 247, 0.1);
    }
  }
`

const FormSelect = <T,>({
  selectedValue,
  optionList,
  onSelect,
  size,
  containerStyle,
  menuContainerStyle,
  selectedTextStyle,
}: FormSelectProps<T>): ReactElement => {
  return (
    <StyledDropdown>
      <StyledDropdownToggle
        variant="secondary"
        size={size}
        style={containerStyle}
      >
        <Text style={selectedTextStyle}>
          {optionList.find((x) => x.value === selectedValue)?.label}
        </Text>
        <CaretDownFill style={{ fontSize: 8, marginTop: -2 }} />
      </StyledDropdownToggle>
      <StyledDropdownMenu style={menuContainerStyle}>
        {_.map(optionList, (option, i) => (
          <StyledDropdownItem
            key={`option-${i}`}
            onClick={(): void => {
              if (option.isDisabled) {
                return
              }
              onSelect(option.value)
            }}
          >
            <Text
              style={{
                ...selectedTextStyle,
                color: option.isDisabled ? COLOR.blueGray : COLOR.white,
              }}
            >
              {option.label}
            </Text>
          </StyledDropdownItem>
        ))}
      </StyledDropdownMenu>
    </StyledDropdown>
  )
}

export default FormSelect
