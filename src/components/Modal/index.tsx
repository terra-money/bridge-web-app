import { ReactElement, useState } from 'react'
import Modal from 'react-modal'
import styled from 'styled-components'
import { X } from 'react-bootstrap-icons'

import { COLOR, STYLE } from 'consts'

const StyledModal = styled(Modal)`
  width: 620px;
  outline: 0;
  margin: auto;
  background-color: #1e2026;
  border-radius: ${STYLE.css.borderRadius};
  overflow: hidden;
`

const StyledModalHeader = styled.div`
  position: relative;
  text-align: center;
  padding: 16px;
  font-size: 14px;
`

const StyledModalHeaderClose = styled.a`
  position: absolute;
  top: 5px;
  right: 5px;
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
  close: () => void
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
        <StyledModalHeaderClose onClick={close}>
          <X size={24} />
        </StyledModalHeaderClose>
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
