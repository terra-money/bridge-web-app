import { ReactElement } from 'react'
import _ from 'lodash'
import styled from 'styled-components'
import { Dropdown } from 'react-bootstrap'

import { COLOR } from 'consts'
import Text from './Text'

type FormSelectProps<T> = {
  selectedValue: T
  optionList: { value: T; label: string; isDisabled?: boolean }[]
  hideSelected?: boolean
  onSelect: (value: T) => void
  size?: 'sm' | 'lg'
}

const StyledDropdownItem = styled(Dropdown.Item)`
  border-top: solid 1px #292929;
  padding: 8px 10px;
  font-size: 13px;
  :hover {
    background-color: ${COLOR.darkGray2};
  }
  :first-child {
    border-top: 0;
  }
`

const FormSelect = <T,>({
  selectedValue,
  optionList,
  hideSelected,
  onSelect,
  size,
}: FormSelectProps<T>): ReactElement => {
  return (
    <Dropdown>
      {hideSelected ? (
        <Dropdown.Toggle
          split
          variant="secondary"
          size={size}
          style={{
            fontSize: 14,
            backgroundColor: COLOR.darkGray2,
            border: 0,
            outline: 0,
            width: '30px',
            height: '30px',
            marginTop: 5,
            marginBottom: 5,
          }}
        />
      ) : (
        <Dropdown.Toggle
          variant="secondary"
          size={size}
          style={{
            fontSize: 12,
            backgroundColor: COLOR.darkGray2,
            border: 0,
            outline: 0,
            marginTop: -2,
          }}
        >
          {optionList.find((x) => x.value === selectedValue)?.label}
        </Dropdown.Toggle>
      )}
      <Dropdown.Menu
        style={{
          backgroundColor: COLOR.darkGray,
          marginTop: 5,
          border: 0,
          boxShadow: 'rgba(0, 0, 0, 0.5) 0px 5px 10px',
          padding: 0,
          overflow: 'hidden',
        }}
      >
        {_.map(optionList, (option, i) => {
          return (
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
          )
        })}
      </Dropdown.Menu>
    </Dropdown>
  )
}

export default FormSelect
