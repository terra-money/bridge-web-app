import BN from 'bignumber.js'
import { isNil } from 'ramda'

const plus = (a?: BN.Value, b?: BN.Value): string =>
  new BN(a || 0).plus(b || 0).toString()

const minus = (a?: BN.Value, b?: BN.Value): string =>
  new BN(a || 0).minus(b || 0).toString()

const times = (a?: BN.Value, b?: BN.Value): string =>
  new BN(a || 0).times(b || 0).toString()

const div = (a?: BN.Value, b?: BN.Value): string =>
  new BN(a || 0).div(b || 1).toString()

const pow = (a: BN.Value, b: BN.Value): string => new BN(a).pow(b).toString()

const sum = (array: BN.Value[]): string =>
  array.length ? BN.sum.apply(null, array.filter(isFinite)).toString() : '0'

const min = (array: BN.Value[]): string =>
  BN.min.apply(null, array.filter(isFinite)).toString()

const max = (array: BN.Value[]): string =>
  BN.max.apply(null, array.filter(isFinite)).toString()

const ceil = (n: BN.Value): string =>
  new BN(n).integerValue(BN.ROUND_CEIL).toString()

const floor = (n: BN.Value): string =>
  new BN(n).integerValue(BN.ROUND_FLOOR).toString()

const abs = (n: BN.Value): string => new BN(n).abs().toString()

/* format */
const number = (n: BN.Value): number => new BN(n).toNumber()

/* boolean */
const gt = (a: BN.Value, b: BN.Value): boolean => new BN(a).gt(b)
const lt = (a: BN.Value, b: BN.Value): boolean => new BN(a).lt(b)
const gte = (a: BN.Value, b: BN.Value): boolean => new BN(a).gte(b)
const lte = (a: BN.Value, b: BN.Value): boolean => new BN(a).lte(b)

const isFinite = (n?: BN.Value): boolean => !isNil(n) && new BN(n).isFinite()

const isInteger = (n?: BN.Value): boolean => !isNil(n) && new BN(n).isInteger()

export default {
  plus,
  minus,
  times,
  div,
  pow,
  sum,
  min,
  max,
  ceil,
  floor,
  abs,
  number,
  gt,
  lt,
  gte,
  lte,
  isFinite,
  isInteger,
}
