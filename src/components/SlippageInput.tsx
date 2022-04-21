import { ReactElement } from 'react'
import styled from 'styled-components'

import { COLOR } from 'consts'
import { useRecoilState } from 'recoil'
import SendStore from 'store/SendStore'

const StyledContainer = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin: 1.4rem 0;
`

const StyledSlippageContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`

const StyledSlippage = styled.div<{ active: boolean }>`
  background-color: ${COLOR.darkGray2};
  padding: 0.25rem 0.8rem;
  margin: 0 0.3rem;
  font-size: small;
  border-radius: 1rem;
  cursor: pointer;
  color: ${({ active }): string => (active ? COLOR.terraSky : '#737373')};
`

const StyledSlippageInputContainer = styled.div`
  background-color: ${COLOR.darkGray};
  padding: calc(0.25rem - 2px) 0.7rem calc(0.25rem - 2px) 0.4rem;
  margin: 0 0.3rem;
  font-size: small;
  border-radius: 1rem;
  color: #737373;
  border: 1px solid #737373;
`

const StyledSlippageInput = styled.input`
  background-color: ${COLOR.darkGray};
  font-size: small;
  color: #737373;
  outline: none;
  border: 0;
  width: 20px;
  text-align: right;
`

const SlippageInput = (): ReactElement => {
  const [slippage, setSlippage] = useRecoilState(SendStore.slippageTolerance)

  return (
    <StyledContainer>
      <p style={{ fontSize: 'small', color: '#737373' }}>Slippage tolerance</p>

      <StyledSlippageContainer>
        <StyledSlippageInputContainer>
          <StyledSlippageInput
            value={slippage}
            type="number"
            onChange={({ target: { value } }): void =>
              setSlippage(Number(value))
            }
          />{' '}
          %
        </StyledSlippageInputContainer>
        <StyledSlippage
          active={slippage === 0.5}
          onClick={(): void => setSlippage(0.5)}
        >
          0.5 %
        </StyledSlippage>
        <StyledSlippage
          active={slippage === 1}
          onClick={(): void => setSlippage(1)}
        >
          1 %
        </StyledSlippage>
        <StyledSlippage
          active={slippage === 3}
          onClick={(): void => setSlippage(3)}
        >
          3 %
        </StyledSlippage>
      </StyledSlippageContainer>
    </StyledContainer>
  )
}

export default SlippageInput
