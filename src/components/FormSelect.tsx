import { CSSProperties, ReactElement, useState } from 'react'
import _ from 'lodash'
import styled from 'styled-components'
import { Dropdown } from 'react-bootstrap'

import { COLOR } from 'consts'
import Text from './Text'

type FormSelectProps<T> = {
  defaultValue: T
  optionList: { value: T; label: string; isDisabled?: boolean }[]
  hideSelected?: boolean
  onSelect: (value: T) => void
  size?: 'sm' | 'lg'
  buttonStyle?: CSSProperties
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
  defaultValue,
  optionList,
  hideSelected,
  onSelect,
  size,
  buttonStyle,
}: FormSelectProps<T>): ReactElement => {
  const defaultOption =
    optionList.find((x) => x.value === defaultValue) || optionList[0]
  const [selected, setSelected] = useState(defaultOption)
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
          {selected.label}
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
                setSelected(option)
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
