import { createElement, ReactElement } from 'react'
import { IQRCodeModal, IQRCodeModalOptions } from '@walletconnect/types'
import QRCode from 'qrcode.react'
import { render } from 'react-dom'
import styled, { keyframes } from 'styled-components'
import { isBrowser } from 'react-device-detect'

export class TerraWalletconnectQrcodeModal implements IQRCodeModal {
  modalContainer: HTMLDivElement | null = null

  private callback: (() => void) | null = null

  setCloseCallback = (callback: () => void): void => {
    this.callback = callback
  }

  open = (uri: string, _qrcodeModalOptions?: IQRCodeModalOptions): void => {
    const modalContainer = window.document.createElement('div')

    const query = encodeURIComponent(
      `action=walletconnect_connect&payload=${btoa(JSON.stringify({ uri }))}`
    )

    const value = `https://terrastation.page.link/?link=https://terra.money?${query}&apn=money.terra.station&ibi=money.terra.station&isi=1548434735`

    const modal = createElement(TerraQRCodeModal, {
      value,
      onClose: () => {
        if (this.callback) {
          this.callback()
          this.callback = null
        }
        this.close()
      },
    })

    render(modal, modalContainer)
    if (isBrowser) {
      window.document.querySelector('body')?.appendChild(modalContainer)
    } else {
      window.location.href = value
    }

    this.modalContainer = modalContainer
  }

  close = (): void => {
    if (this.modalContainer) {
      this.modalContainer.parentElement?.removeChild(this.modalContainer)
    }

    this.callback = null
  }
}

const TerraQRCodeModalBase = ({
  value,
  className,
  onClose,
}: {
  value: string
  className?: string
  onClose: () => void
}): ReactElement => {
  return isBrowser ? (
    <div className={className}>
      <div onClick={onClose} />
      <figure>
        <QRCode value={value} size={300} />
      </figure>
    </div>
  ) : (
    <></>
  )
}

const modalEnter = keyframes`
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
`

const figureEnter = keyframes`
  0% {
    opacity: 0;
    transform: scale(0.4);
  }

  100% {
    opacity: 1;
    transform: scale(1);
  }
`

const TerraQRCodeModal = styled(TerraQRCodeModalBase)`
  position: fixed;
  z-index: 100000;

  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;

  display: grid;
  place-content: center;

  > div {
    position: fixed;
    z-index: -1;

    left: 0;
    top: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.3);

    animation: ${modalEnter} 0.2s ease-in-out;
  }

  > figure {
    padding: 30px;

    border-radius: 25px;

    background-color: #ffffff;
    box-shadow: 0 4px 18px 3px rgba(0, 0, 0, 0.43);

    animation: ${figureEnter} 0.2s ease-in-out;
  }
`
