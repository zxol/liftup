import { prop, adjust, map, negate, useWith, curry as _c } from 'ramda'
import { autoCurry, autoZipWith, seq } from './functional.js'

const isNumber = x => !isNaN(x)
export const isComplex = x => Array.isArray(x) && x.length === 2
export const toComplex = u => {
  if (isComplex(u)) return u
  if (isNumber(u)) return [u, 0]
  return NaN
}
export const maxDecimal = _c((n, x) => {
  const factor = 10 ** n
  return map(y => {
    const rounded = Math.round((y + Number.EPSILON) * factor) / factor
    if (Object.is(rounded, -0)) return 0
    return rounded
  }, x)
})
export const readableArray = map(_c(maxDecimal)(4))
export const toComplexArr = arr => map(u => (Array.isArray(u) ? toComplexArr(u) : toComplex(u)), arr)
export const withReal = f => useWith(f, [toComplex, toComplex])
export const add = _c(([x, yi], [u, vi]) => [x + u, yi + vi])
export const sub = _c(([x, yi], [u, vi]) => [x - u, yi - vi])
export const mul = _c(([x, yi], [u, vi]) => [x * u - yi * vi, x * vi + yi * u])
export const _mul = _c(([x, yi], [u, vi]) => [x * u, yi * vi])
export const div = _c((x, y) => {
  const [a, bi] = x
  const [c, di] = y
  const denom = c ** 2 + di ** 2
  return [(a * c + bi * di) / denom, (bi * c - a * di) / denom]
})
export const scale = _c((amt, [x, yi]) => [amt * x, amt * yi])
export const scaleArr = map(scale)
export const mag = ([x, yi]) => Math.hypot(x, yi)
export const abs = mag
export const phase = ([x, yi]) => Math.atan2(x, yi)
export const arg = phase
export const fromPolar = ([mag, phase]) => [mag * Math.sin(phase), mag * Math.cos(phase)]
export const fromPolarArr = map(fromPolar)
export const toPolar = seq([mag, phase])
export const toPolarArr = map(toPolar)
export const re = prop(0)
export const im = prop(1)
export const conjugate = adjust(1, negate)
export const rotate = _c((theta, [x, yi]) => {
  const ct = Math.cos(theta)
  const st = Math.sin(theta)
  return [x * ct - yi * st, x * st + yi * ct]
})
export const norm = ([x, yi]) => x ** 2 + yi ** 2
export const recip = x => [re(x) / norm(x), im(x) / norm(x)]
export const inverse = recip
export const addmul = _c((a, [x, yi]) => [x + a * x, yi + a * yi])
export const sqrt = x => fromPolar(Math.sqrt(abs(x)), arg(x) * 0.5)
export const neg = ([x, yi]) => [-x, -yi]

export const pow = _c((x, y) => {
  const [c, di] = y
  const inner = c * arg(x) + 0.5 * di * Math.log(norm(x))
  return [Math.cos(inner), Math.sin(inner)]
})

export const exp = x => pow(e, x)

export const sin = ([a, b]) => [Math.sin(a) * Math.cosh(b), Math.cos(a) * Math.sinh(b)]
export const cos = ([a, b]) => [Math.cos(a) * Math.cosh(b), Math.sin(a) * Math.sinh(b)]
export const tan = ([a, b]) => {
  const denom = Math.cos(2 * a) + Math.cosh(2 * b)
  return [Math.sin(2 * a) / denom, Math.sinh(2 * b) / denom]
}

export const e = [Math.E, 0]
export const i = [0, 1]
export const pi = [Math.PI, 0]
export const zero = [0, 0]

// module.exports = autoCurry(module.exports)
// module.exports = autoZipWith(module.exports)
