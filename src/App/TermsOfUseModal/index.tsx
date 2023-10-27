import { ReactElement, useState } from 'react'
import styled from 'styled-components'
import DefaultModal from 'components/Modal'
import { Button, Text } from 'components'
import { Checkbox } from '@mui/material'

const StyledContainer = styled.div`
  padding: 18px 32px 40px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`

const TextContainer = styled.div`
  display: inline-block;
  font-size: 14px;
  margin: 0 12px;
`

const Link = styled.a`
  color: #fff;
  text-decoration: underline;
  font-weight: 500;
`

const CheckboxContainer = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 24px;
`

const BottomWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 12px;

  p {
    font-size: 11px;
    color: hsl(0 0% 55%);
    margin: 0;

    a {
      color: hsl(0 0% 55%);
      text-decoration: underline;
    }
  }
`

const ButtonWrapper = styled.div`
  display: flex;
  gap: 8px;
  justify-content: center;
`

const TermsOfUseModal = (): ReactElement | null => {
  const [isOpen, setIsOpen] = useState(true)
  const [checked, setChecked] = useState(false)

  const hasAcceptedCurrent = localStorage.getItem(
    'TermsOfUseAccepted_Oct-3-2023'
  )

  const handleAccept = (): void => {
    localStorage.setItem('TermsOfUseAccepted_Oct-3-2023', 'true')
    setIsOpen(false)
  }

  if (hasAcceptedCurrent === 'true') return null

  return (
    <DefaultModal
      {...{
        isOpen: isOpen,
      }}
      header={<Text style={{ justifyContent: 'center' }}>Terms of Use</Text>}
    >
      <StyledContainer>
        <TextContainer>
          <Text style={{ display: 'inline' }}>
            Please check the box below to confirm your agreement to the{' '}
          </Text>
          <Link
            href="https://drive.google.com/file/d/1A4B41Cy2lR0nQnlAVLGgjNcFParcbnA_/view?usp=drive_link"
            target="_blank"
            rel="noreferrer"
          >
            Terms of Use
          </Link>
          <Text style={{ display: 'inline' }}> and </Text>
          <Link
            href="https://assets.website-files.com/611153e7af981472d8da199c/631ac874c79cf645a2f9b5ee_PrivacyPolicy.pdf"
            target="_blank"
            rel="noreferrer"
          >
            Privacy Policy
          </Link>
          .
        </TextContainer>
        <CheckboxContainer>
          <Checkbox
            checked={checked}
            onChange={(): void => setChecked(!checked)}
            style={{ color: '#fff' }}
          />
          <Text style={{ justifyContent: 'center', fontSize: '12px' }}>
            I have read and understand, and do hereby agree to be bound by the
            Terms of Use and Privacy Policy, including all future amendments
            thereto.
          </Text>
        </CheckboxContainer>
        <BottomWrapper>
          <ButtonWrapper>
            <Button color="primary" disabled={!checked} onClick={handleAccept}>
              Accept & Continue
            </Button>
            <Button
              style={{ backgroundColor: '#727e8b' }}
              onClick={(): string =>
                (window.location.href = 'https://terra.money')
              }
            >
              Reject & Exit
            </Button>
          </ButtonWrapper>
          <p>
            Clicking <strong>"Reject & Exit"</strong> will route you to{' '}
            <a href="https://terra.money">
              <strong>terra.money</strong>
            </a>
          </p>
        </BottomWrapper>
      </StyledContainer>
    </DefaultModal>
  )
}

export default TermsOfUseModal
