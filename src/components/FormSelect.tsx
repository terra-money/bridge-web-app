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
  :hover {
    background-color: ${COLOR.blueGray};
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
          style={buttonStyle}
        />
      ) : (
        <Dropdown.Toggle variant="secondary" size={size} style={buttonStyle}>
          {selected.label}
        </Dropdown.Toggle>
      )}
      <Dropdown.Menu style={{ backgroundColor: COLOR.darkGray2 }}>
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
