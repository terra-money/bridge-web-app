import BigNumber from 'bignumber.js'
import _ from 'lodash'

import currency from './currency'

const truncate = (text: string = '', [h, t]: number[] = [8, 6]): string => {
  const head = text.slice(0, h)
  const tail = text.slice(-1 * t, text.length)
  return text.length > h + t ? [head, tail].join('...') : text
}

const jsonTryParse = <T>(value: string): T | undefined => {
  try {
    return JSON.parse(value) as T
  } catch {
    return undefined
  }
}

const setComma = (str: string | number): string => {
  const parts = _.toString(str).split('.')
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return parts.join('.')
}

const delComma = (str: string | number): string => {
  return _.toString(str).replace(/,/g, '')
}

const extractNumber = (str: string): string => str.replace(/\D+/g, '')

const isNativeTerra = (str: string): boolean =>
  str.startsWith('u') &&
  currency.currencies.includes(str.slice(1).toUpperCase())

const isNativeDenom = (str: string): boolean =>
  str === 'uluna' || isNativeTerra(str)

const toBignumber = (value?: string): BigNumber => new BigNumber(value || 0)

export default {
  truncate,
  jsonTryParse,
  setComma,
  delComma,
  extractNumber,
  isNativeTerra,
  isNativeDenom,
  toBignumber,
}
