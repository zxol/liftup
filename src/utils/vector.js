import * as math from './math.js'
import { map, sum, pipe, curry as _c } from 'ramda'
import { rotate, add as addmjs } from 'mathjs'
import { mapF } from './array.js'

// export { ones, zeroes, identity, hypot as mag } from 'mathjs'
// export { size } from './array.js'
// export const ones = ones
// export const zeroes = zeroes
// export const identity = identity
// export const size = size
// export const mag = hypot

export const z3 = () => [0, 0, 0]
export const squareSum = pipe(map(math.powFlipped(2)), sum)
export const scale = _c((amt, v) => map(math.mul(amt), v))
export const scl = scale
export const add = _c(addmjs)
export const rot2 = _c((theta, v) => rotate(v, theta))
export const rot3x = _c((theta, v) => rotate(v, theta, [1, 0, 0]))
export const rot3y = _c((theta, v) => rotate(v, theta, [0, 1, 0]))
export const rot3z = _c((theta, v) => rotate(v, theta, [0, 0, 1]))

export const project1Dto2DZeroToOne = mapF((y, x) => [x, y])
export const project1Dto2DNegOneToOne = mapF((y, x) => [x * 2 - 1, y])
export const project1Dto2DBounds = _c((xStart, xFinish, arr) =>
  mapF((y, x) => [math.map(0, 1, xStart, xFinish, x), y], arr)
)
