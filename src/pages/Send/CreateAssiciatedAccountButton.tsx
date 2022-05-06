import { ReactElement } from 'react'
import { useSetRecoilState, useRecoilState } from 'recoil'
import SendStore from 'store/SendStore'

import { PublicKey } from '@solana/web3.js'

import { Button } from 'components'

import SendProcessStore, { ProcessStatus } from 'store/SendProcessStore'

import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
  Token,
} from '@solana/spl-token'

const CreateAssiciatedAccountButton = (): ReactElement => {
  const setStatus = useSetRecoilState(SendProcessStore.sendProcessStatus)
  const toAddress = useRecoilState(SendStore.toAddress)
  const [toAssociatedTokenAccountAddress, setToAssociatedTokenAccountAddress] =
    useRecoilState(SendStore.toAssociatedTokenAccountAddress)

  const onClickButton = async (): Promise<void> => {
    const assTokenKey = await Token.getAssociatedTokenAddress(
      ASSOCIATED_TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      new PublicKey('9vMJfxuKxXBoEa7rM12mYLMwTacLMLDJqHozw96WQL8i'),
      new PublicKey(toAddress)
    )
    setToAssociatedTokenAccountAddress(assTokenKey.toString())
    setStatus(ProcessStatus.Input)
  }

  return (
    <Button
      onClick={onClickButton}
      disabled={!!toAssociatedTokenAccountAddress}
    >
      {toAssociatedTokenAccountAddress
        ? toAssociatedTokenAccountAddress
        : `Create associated token account`}
    </Button>
  )
}

export default CreateAssiciatedAccountButton
