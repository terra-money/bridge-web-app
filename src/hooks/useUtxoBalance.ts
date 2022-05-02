import axios from 'axios'
import { useRecoilValue } from 'recoil'
import AuthStore from 'store/AuthStore'

const useUtxoBalance = (): {
  getUtxoBalance(chain: string): Promise<string>
} => {
  const loginUser = useRecoilValue(AuthStore.loginUser)

  const getUtxoBalance = async (chain: string): Promise<string> => {
    const {
      data: { data },
    } = await axios.get(
      `https://sochain.com/api/v2/get_address_balance/${chain}/${loginUser.address}`
    )
    return (parseFloat(data['confirmed_balance']) * 1e8).toFixed(0)
  }
  return { getUtxoBalance }
}

export default useUtxoBalance
