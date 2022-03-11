import axios from 'axios'
const LCD = 'https://lcd.injective.network/'

interface SequenceResponse {
  accountNumber: number
  sequence: number
}

export async function getInjectiveSequence(
  address: string
): Promise<SequenceResponse> {
  const result = await axios.get(
    LCD + '/cosmos/auth/v1beta1/accounts/' + address
  )
  const accountNumber = parseInt(
    result.data.account.base_account.account_number
  )
  const sequence = parseInt(result.data.account.base_account.sequence)

  return { accountNumber, sequence }
}
