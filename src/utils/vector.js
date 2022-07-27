import * as m from './math.js'
import { map, sum, pipe, curry as _c, transpose, prop, compose, identity } from 'ramda'
import { mapF, timesF, mapMap } from './array.js'
import { rotate, add as addmjs, subtract as submjs, hypot as mag, multiply as mul } from 'mathjs'
export { ones, zeros, identity, distance as dist } from 'mathjs'
export { mag, mul, transpose, rotate }

const sin = Math.sin,
  cos = Math.cos,
  tan = Math.tan,
  atan2 = Math.atan2

export const up = [0, 1, 0]
export const down = [0, -1, 0]
export const left = [-1, 0, 0]
export const right = [1, 0, 0]
export const into = [0, 0, -1]
export const outward = [0, 0, 1]
export const qs = [m.halfpi / 2, m.pi, m.pi + m.halfpi, m.tau]

export const tidyFloat = number => {
  const num = Math.round(number * 1e8) / 1e8
  return num == -0 ? 0 : num
}
export const mapTidy = map(tidyFloat)
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

export const spherical2Rect = ([dist, long, lat]) => {
  const z = dist * cos(lat) * sin(long)
  const y = dist * sin(lat) * sin(long)
  const x = dist * cos(long)
  // console.log(mapTidy([x, y, z]))
  // return mapTidy([x, y, z])
  return [x, y, z]
}

export const rect2spherical = ([x, y, z]) => {
  const dist = m.sqrt(x ** 2 + y ** 2 + z ** 2)
  const long = Math.atan2(y, x)
  const lat = Math.acos(z / dist)
  return [dist, long, lat]
}
const reverseRotMat = identity

export const tbAnglesZXYToRotMatrix = vect => {
  const c = n => Math.cos(vect[n - 1])
  const s = n => Math.sin(vect[n - 1])
  const c1 = c(1),
    c2 = c(2),
    c3 = c(3),
    s1 = s(1),
    s2 = s(2),
    s3 = s(3)
  return reverseRotMat([
    [c1 * c3 - s1 * s2 * s3, -c2 * s1, c1 * s3 + c3 * s1 * s2],
    [c3 * s1 + c1 * s2 * s3, c1 * c2, s1 * s3 - c1 * c3 * s2],
    [-c2 * s3, s2, c2 * c3]
  ])
}

export const rotMatrixTotbAnglesZXY = rMat => {
  const R = (row, col) => rMat[row - 1][col - 1]
  return [Math.atan(-R(1, 2) / R(2, 2)), Math.atan(R(3, 2) / m.sqrt(1 - R(3, 2) ** 2)), Math.atan(-R(3, 1) / R(3, 3))]
}

export const testZXY = compose(rotMatrixTotbAnglesZXY, tbAnglesZXYToRotMatrix)

export const angles = vect => {
  const [x, y, z] = unit(vect)

  let rotx = 0 //Math.atan2(y, z)
  let rotz = Math.acos(y)
  let roty = Math.atan2(z, -x)
  return mapTidy([rotx, roty, rotz])
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
