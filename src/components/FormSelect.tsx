import { ReactElement } from 'react'
import _ from 'lodash'
import styled from 'styled-components'
import { Dropdown } from 'react-bootstrap'
import { CaretDownFill } from 'react-bootstrap-icons'

import { COLOR } from 'consts'
import Text from './Text'

type FormSelectProps<T> = {
  selectedValue: T
  optionList: { value: T; label: string; isDisabled?: boolean }[]
  onSelect: (value: T) => void
  size?: 'sm' | 'lg'
  containerStyle?: React.CSSProperties
}

const StyledDropdownItem = styled(Dropdown.Item)`
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

const StyledDropdownToggle = styled(Dropdown.Toggle)`
  width: 100%;
  height: 100%;
  padding: 13px 12px 12px 15px;
  border-width: 0;
  border-radius: 10px;
  box-shadow: 0 12px 7px -7px rgba(0, 0, 0, 0.34);
  background-color: #2e2e2e;
  display: flex;
  justify-content: space-between;
  align-items: center;
  ::after {
    display: none;
  }
  :hover {
    background-color: #494e59;
  }
`

const StyledDropdownMenu = styled(Dropdown.Menu)`
  background-color: ${COLOR.darkGray};
  margin-top: 5;
  border: 0;
  box-shadow: rgba(0, 0, 0, 0.5) 0px 5px 10px;
  padding: 0;
  overflow: hidden;
`

const FormSelect = <T,>({
  selectedValue,
  optionList,
  onSelect,
  size,
  containerStyle,
}: FormSelectProps<T>): ReactElement => {
  return (
    <Dropdown style={containerStyle}>
      <StyledDropdownToggle variant="secondary" size={size}>
        <Text>{optionList.find((x) => x.value === selectedValue)?.label}</Text>
        <CaretDownFill style={{ fontSize: 12, marginTop: -2 }} />
      </StyledDropdownToggle>
      <StyledDropdownMenu>
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
                color: option.isDisabled ? COLOR.blueGray : COLOR.white,
              }}
            >
              {option.label}
            </Text>
          </StyledDropdownItem>
        ))}
      </StyledDropdownMenu>
    </Dropdown>
  )
}

export default FormSelect
