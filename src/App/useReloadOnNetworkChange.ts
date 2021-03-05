/**
 * @see {@link https://docs.ethers.io/v5/concepts/best-practices}
 */

import { ethers } from 'ethers'
import { useEffect } from 'react'

const useReloadOnNetworkChange = (): void => {
  useEffect(() => {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum, 'any')

      provider.on('network', (newNetwork, oldNetwork) => {
        if (oldNetwork) {
          window.location.reload()
        }
      })
    }
  }, [])
}

export default useReloadOnNetworkChange
