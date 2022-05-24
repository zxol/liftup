import * as m from './math.js'
import { map, sum, pipe, curry as _c, transpose, prop } from 'ramda'
import { mapF, timesF } from './array.js'
import { rotate, add as addmjs, subtract as submjs, hypot as mag, multiply as mul } from 'mathjs'
export { ones, zeros, identity, distance as dist } from 'mathjs'
export { mag, mul, transpose, rotate }

export const up = [0, 1, 0]
export const down = [0, -1, 0]
export const left = [-1, 0, 0]
export const right = [1, 0, 0]
export const into = [0, 0, -1]
export const outward = [0, 0, 1]
export const qs = [m.halfpi / 2, m.pi, m.pi + m.halfpi, m.tau]

const tidyFloat = number => {
  const num = Math.round(number * 1e15) / 1e15
  return num === -0 ? 0 : num
}
const mapTidy = map(tidyFloat)
export const d2r = x => (m.tau * x) / 360
export const r2d = x => (360 * x) / m.tau
export const z3 = () => [0, 0, 0]
export const squareSum = pipe(map(m.powFlipped(2)), sum)
export const scale = _c((amt, v) => map(m.mul(amt), v))
export const scl = scale
export const add = _c(addmjs)
export const sub = _c(submjs)
export const rot2 = _c((theta, v) => rotate(v, theta))
export const rot3x = _c((theta, v) => rotate(v, theta, [1, 0, 0]))
export const rot3y = _c((theta, v) => rotate(v, theta, [0, 1, 0]))
export const rot3z = _c((theta, v) => rotate(v, theta, [0, 0, 1]))
export const rot3test = ([x, y, z], v) => mapTidy(rot3z(z, rot3y(y, rot3x(x, v))))
export const anglesOLD = v => {
  const rMat = rotM(v)
  const R = (row, col) => rMat[row - 1][col - 1]
  let θ, ψ, φ
  if (!(R(3, 1) === 1 || R(3, 1) === -1)) {
    θ = -Math.asin(R(3, 1))
    ψ = Math.atan2(R(3, 2) / Math.cos(θ), R(3, 3) / Math.cos(θ))
    φ = Math.atan2(R(2, 1) / Math.cos(θ), R(1, 1) / Math.cos(θ))
  } else {
    φ = 0
    if (R(3, 1) === -1) {
      θ = m.halfpi
      ψ = Math.atan2(R(1, 2), R(1, 3))
    } else {
      θ = -m.halfpi
      ψ = Math.atan2(-R(1, 2), -R(1, 3))
    }
  }
  return [θ, ψ, φ]
}

// export const angles = vect => {
//   const [x, y, z] = unit(vect)
//   let rotz,
//     roty = Math.atan2(z, x)
//   if (x >= 0) {
//     rotz = -Math.atan2(y * Math.cos(roty), x)
//   } else {
//     rotz = Math.atan2(y * Math.cos(roty), -x)
//   }
//   // rotx = m.hpi - Math.atan2(y * Math.cos(roty), x)
//   return [0, roty, rotz]
// }
export const angles = vect => {
  const [x, y, z] = unit(vect)
  let rotx,
    roty = Math.atan2(x, y)
  // if (y >= 0) {
  //   rotx = -Math.atan2(y * Math.cos(roty), x)
  // } else {
  //   rotx = Math.atan2(y * Math.cos(roty), -x)
  // }
  rotx = m.hpi - Math.atan2(y * Math.cos(roty), x)
  return [rotx, roty, 0]
}
export const anglesOLD2 = ([x, y, z]) => {
  let roty
  const rotx = Math.atan2(y, z) - m.halfpi
  if (z >= 0) {
    roty = -Math.atan2(x * Math.cos(rotx), z) //- m.halfpi
  } else {
    roty = Math.atan2(x * Math.cos(rotx), -z) - m.halfpi
  }
  const rotz = 0 //Math.atan2(Math.cos(rotx), Math.sin(rotx) * Math.sin(roty))
  return [rotx, roty, rotz]
}

const sin = Math.sin
const cos = Math.cos
export const rotM = ([a, b, y]) => {
  const cosa = cos(a),
    cosb = cos(b),
    cosy = cos(y),
    sina = sin(a),
    sinb = sin(b),
    siny = sin(y)

  return [
    [cosb * cosy, sina * sinb * cosy - cosa * siny, cosa * sinb * cosy + sina * siny],
    [cosb * siny, sina * sinb * siny + cosa * cosy, cosa * sinb * siny - sina * cosy],
    [-sinb, sina * cosb, cosa * cosb]
  ]
}

export const toCol = map(Array.of)
export const toRow = map(prop(0))
export const rot3 = (thetas, v) => mapTidy(toRow(mul(rotM(thetas), toCol(v))))
export const rotu2 = _c((theta, v) => rotate(v, theta * m.tau))
export const rotu3x = _c((theta, v) => rotate(v, theta * m.tau, [1, 0, 0]))
export const rotu3y = _c((theta, v) => rotate(v, theta * m.tau, [0, 1, 0]))
export const rotu3z = _c((theta, v) => rotate(v, theta * m.tau, [0, 0, 1]))

export const unit = v => scl(1 / mag(v), v)

const quadrants = (f, x, y) => {
  if (x > 0) return f(y / x)
  if (x < 0 && y >= 0) return f(y / x) + m.pi
  if (x < 0 && y < 0) return f(y / x) - m.pi
  if (x === 0 && y > 0) return m.halfpi
  if (x === 0 && y > 0) return -m.halfpi
  return undefined
}

export const project1Dto2DZeroToOne = mapF((y, x) => [x, y])
export const project1Dto2DNegOneToOne = mapF((y, x) => [x * 2 - 1, y])
export const project1Dto2DBounds = _c((xStart, xFinish, arr) =>
  mapF((y, x) => [m.map(0, 1, xStart, xFinish, x), y], arr)
)
