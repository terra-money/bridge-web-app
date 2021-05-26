import { ReactElement, useState } from 'react'
import Modal from 'react-modal'
import styled from 'styled-components'
import { X } from 'react-bootstrap-icons'

import { COLOR, STYLE } from 'consts'

const StyledModal = styled(Modal)`
  width: 550px;
  outline: 0;
  margin: auto;
  background-color: ${COLOR.darkGray2};
  border-radius: 32px;
  overflow: hidden;
  @media ${STYLE.media.mobile} {
    border-radius: 0;
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
    margin-bottom: 0;
  }
`

const StyledModalHeader = styled.div`
  position: relative;
  text-align: center;
  padding-top: 28px;
  padding-bottom: 35px;
  font-size: 16px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: -0.25px;
  justify-content: center;
  @media ${STYLE.media.mobile} {
    padding-bottom: 26px;
  }
`

const StyledModalHeaderClose = styled.a`
  position: absolute;
  top: 15px;
  right: 15px;
  display: inline-block;
  padding: 10px;
  cursor: pointer;
  color: ${COLOR.text};
  :hover {
    color: ${COLOR.primary};
    text-decoration: none;
  }
`

Modal.setAppElement('#root')

const DefaultModal = ({
  isOpen,
  close,
  children,
  onRequestClose,
  header,
}: {
  isOpen: boolean
  close?: () => void
  children: ReactElement
  onRequestClose?: () => void
  header?: ReactElement
}): ReactElement => {
  return (
    <StyledModal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={{
        overlay: {
          backgroundColor: 'rgba(0,0,0,.9)',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
        },
      }}
    >
      <StyledModalHeader>
        {header}
        {close && (
          <StyledModalHeaderClose onClick={close}>
            <X size={24} />
          </StyledModalHeaderClose>
        )}
      </StyledModalHeader>
      {children}
    </StyledModal>
  )
}

export default DefaultModal

export type ModalProps = {
  isOpen: boolean
  open: () => void
  close: () => void
}

export const useModal = (): ModalProps => {
  const [isOpen, setIsOpen] = useState(false)
  return {
    isOpen,
    open: (): void => setIsOpen(true),
    close: (): void => setIsOpen(false),
  }
}
