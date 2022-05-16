import {
  add,
  addIndex,
  always,
  clone,
  compose,
  concat,
  curry as _c,
  filter,
  flatten,
  head,
  identity,
  init,
  last,
  map,
  max as rmax,
  min as rmin,
  multiply,
  pipe,
  pluck,
  range,
  reduce,
  repeat,
  reverse,
  slice,
  sum,
  take,
  takeLast,
  times,
  transpose,
  type,
  unfold,
  unnest
} from 'ramda'
// import Spline from 'cubic-spline'
import { sech } from 'mathjs'
import { autoCurry } from './functional.js'
import * as math from './math.js'

export const size = (arr, dims = []) => (Array.isArray(arr) ? size(head(arr), [arr.length, ...dims]) : dims)

export const loopPad = _c((amt, arr) => [...takeLast(amt, arr), ...arr, ...take(amt, arr)])
export const unLoopPad = _c((amt, arr) => slice(amt - 1, arr.len - amt))
export const zeroArray = times(always(0))
export const zeroArrayComplex = times(() => [0, 0])
export const padRight = _c((newSize, x, arr) => {
  if (newSize <= arr.length) return arr
  return [...arr, ...repeat(x, newSize - arr.length)]
})
export const padRight0 = _c((newSize, arr) => padRight(newSize, 0, arr))
export const padLeft = _c((newSize, x, arr) => {
  if (newSize <= arr.length) return arr
  return [...repeat(x, newSize - arr.length), ...arr]
})
export const padLeft0 = _c((newSize, arr) => padLeft(newSize, 0, arr))
export const padCenter = _c((x, amt, arr) => [...repeat(x, amt), arr, ...repeat(x, amt)])
export const filterI = addIndex(filter)
export const keepNthIndexes = _c((n, arr) => filterI((_, i) => i % n === 0, arr))
export const keepNthIndexesOffset = _c((offset, n, arr) =>
  filterI((_, i) => i >= offset && (i - offset) % n === 0, arr)
)
export const removeNthIndexes = _c((n, arr) => filterI((_, i) => i % n !== 0, arr))
export const removeNthIndexesOffset = _c((offset, n, arr) =>
  filterI((_, i) => i >= offset && (i - offset) % n !== 0, arr)
)

export const rangeF = _c((start, end, count) => timesF(x => start + (end - start) * x, count))
export const rangeFinc = _c((start, end, count) => timesFinc(x => start + (end - start) * x, count))
export const rangeFs = _c((start, end, stepAmt) => unfold(x => (x > end ? false : [x, x + stepAmt]), start))

export const reduceI = addIndex(reduce)

export const mapI = addIndex(map)
export const mapF = _c((f, arr) => mapI((x, i) => f(x, parseFloat(i) / arr.length, i), arr))
export const mapO = _c((f, arr) => mapI((x, i) => f(x, Math.log2(parseFloat(i + 1)), i), arr))
export const mapFO = _c((f, arr) => mapI((x, o, i) => f(x, parseFloat(i) / arr.length, o, i), arr))
export const mapWithPrev = _c((f, arr) => mapI((x, i) => (i == 0 ? f(x, null) : f(x, arr[i - 1])), arr))
export const mapWithNext = _c((f, arr) => mapI((x, i) => (i == arr.length - 1 ? f(x, null) : f(x, arr[i + 1])), arr))
export const mapWithNextEx = _c((f, arr) => mapI((x, i) => (i == arr.length - 1 ? null : f(x, arr[i + 1])), arr))
export const mapWithNextCirc = _c((f, arr) => mapI((x, i) => f(x, circularRead(arr, i + 1)), arr))
export const mapWithNeighborsCirc = _c((f, arr) =>
  mapI((x, i) => f([circularRead(arr, i - 1), x, circularRead(arr, i + 1)], i), arr)
)
export const mapWithNeighborsZeroBounds = _c((f, arr) =>
  mapI((x, i) => f([i == 0 ? 0 : arr[i - 1], x, i == arr.length - 1 ? 0 : arr[i + 1]], i))
)
export const mapWithNeighborsKeepBounds = _c((f, arr) => {
  const inner = slice(1, -1, arr)
  return [head(arr), ...mapI((x, i) => f([arr[i], x, arr[i + 2]], i + 1), inner), last(arr)]
})

export const updateRow = _c((rowNum, f, arr) => {
  const tarr = transpose(arr)
  tarr[rowNum] = f(tarr[rowNum])
  return transpose(tarr)
})

export const mapMap = _c((f, arr) => map(map(f), arr))
export const mapMapI = _c((f, arr) => mapI((x, i) => mapI((y, j) => f(y, j, i), x), arr))
export const map2D = _c((f, arr) =>
  mapI((row, y) => mapI((element, x) => f(element, [x, y], [arr[0].length, arr.length], arr), row), arr)
)
export const map3D = _c((f, arr) =>
  mapI(
    (plane, z) =>
      mapI(
        (row, y) =>
          mapI((element, x) => f(element, [x, y, z], [arr[0][0].length, arr[0].length, arr.length], arr), row),
        plane
      ),
    arr
  )
)
export const mapFilter = _c((f, arr) =>
  reduceI(
    (acc, x, i) => {
      const result = f(x, i)
      return result === undefined ? acc : [...acc, result]
    },
    [],
    arr
  )
)
export const mapFilter2D = _c((f, arr) =>
  mapFilter((row, y) => {
    let out = mapFilter((element, x) => f(element, [x, y], [arr[0].length, arr.length], arr), row)
    return out.length === 0 || out === undefined ? undefined : out
  }, arr)
)
export const subdivide = _c((amt, arr) => {
  const len = Math.floor(arr.length / amt)
  return times(i => {
    return slice(i * len, i * len + len, arr)
  }, amt)
})
export const times2D = _c((f, _u, _v) => times(v => times(u => f([u, v]), _u), _v))
export const times3D = _c((f, _u, _v, _w) => times(w => times(v => times(u => f([u, v, w]), _u), _v), _w))
export const subdivide2D = _c((amt, arr) => {
  const lenH = Math.floor(arr.length / amt)
  const lenW = Math.floor(arr[0].length / amt)
  return times2D(
    ([u, v]) => {
      const minX = lenW * u,
        minY = lenH * v,
        maxX = minX + lenW,
        maxY = minY + lenH
      return mapFilter2D((cell, [x, y]) => (x < minX || x >= maxX || y < minY || y >= maxY ? undefined : cell), arr)
    },
    amt,
    amt
  )
})
export const flatMap2D = _c((f, arr) =>
  mapI(
    (row, y) => mapI((element, x) => f(element, x + y * arr[0].length, [x, y], [arr[0].length, arr.length], arr), row),
    arr
  )
)

export const flatZipWith2D = _c((f, arr1, arr2D, dims) =>
  flatMap2D((element, index, pos2D, arr) => f(element, arr1[index], pos2D, dims, arr), arr2D)
)
// export const reduceI = addIndex(reduce)

export const timesF = _c((f, count) => times(x => f(parseFloat(x) / count, x), count))
export const timesFO = _c((f, count) => times(x => f(parseFloat(x) / count, Math.log2(parseFloat(x)), x), count))
export const timesFinc = _c((f, count) => times(x => f(parseFloat(x) / (count - 1), x), count))
export const timesFunit = _c((f, count) => times(x => f((2 * parseFloat(x)) / count - 1), count))
export const timesFI = _c((f, count) => (count == 1 ? [f(0)] : times(x => f(parseFloat(x) / (count - 1)), count)))
export const timesP1 = _c((f, count) => times(x => f(x + 1), count))
export const timesFP1 = _c((f, count) => timesF((x, i) => f(x, i + 1), count))
export const timesF2D = _c((f, _u, _v) => timesF((v, j) => timesF((u, i) => f([u, v], i, j), _u), _v))
export const mapMiddle = _c((f, arr) => mapI((x, i, a) => (i === 0 || i === arr.length - 1 ? x : f(x, i, a)), arr))
export const mapSkip = _c((f, skip, arr) => mapI((x, i, a) => (i % skip === 0 ? f(x, i / skip, i, a) : x), arr))
export const mapSkipInvert = _c((f, skip, arr) => mapI((x, i, a) => (i % skip !== 0 ? f(x, i / skip, i, a) : x), arr))
export const mapSkipOffset = _c((f, skip, offset, arr) =>
  mapI((x, i, a) => (i >= offset && (i - offset) % skip === 0 ? f(x, i / skip, i, a) : x), arr)
)
export const mapSkipOffsetInvert = _c((f, skip, offset, arr) =>
  mapI((x, i, a) => (i >= offset && (i - offset) % skip !== 0 ? f(x, i / skip, i, a) : x), arr)
)
export const linearArr = _c((min, max, len) => times(i => min + (max - min) * (parseFloat(i) / len), len))
export const sineArr = _c((startPhase, endPhase, len) => {
  const distance = endPhase - startPhase
  return timesF(i => Math.sin(2 * Math.PI * (startPhase + i * distance)), len)
})

export const sineCurveArr = _c((start, end, len) => {
  const height = end - start
  const offset = end + height / 2
  return sineArr(-0.25, 0.25, len).map(x => {
    return x * Math.abs(height) + offset
  })
})

export const cosArr = _c((startPhase, endPhase, len) => {
  const distance = endPhase - startPhase
  return timesF(i => Math.cos(2 * Math.PI * (startPhase + i * distance)), len)
})

export const sliceF = _c((start, end, arr) => slice(start * arr.length, end * arr.length, arr))

export const interpolateLinSampleCirc = _c((x, arr) => {
  if (x >= 1 || x < 0) x = math.mod(x, 1)
  const pos = Math.floor(arr.length * x)
  const p1 = circularRead(arr, pos)
  const p2 = circularRead(arr, pos + 1)
  const len = p2 - p1
  const fraction = math.mod(pos, 1)
  return p1 + len * fraction
})

export const interpolateLinSampleZero = _c((x, arr) => {
  if (x >= 1 || x < 0) return 0
  const pos = arr.length * x
  const posi = Math.floor(pos)
  const p1 = zeroBoundRead(arr, posi)
  const p2 = zeroBoundRead(arr, posi + 1)
  const len = p2 - p1
  const fraction = math.mod(pos, 1)
  // console.log({ x, posi, p1, fraction })
  return p1 + len * fraction
})

// export const interpolateCubicCircFunction = arr => {
//   const arrContinued = flatten([takeLast(2, arr), arr, take(2, arr)])
//   const xStep = 1 / arr.length
//   const xValues = flatten([-(2 * xStep), -xStep, timesF(x => x, arr.length), 1, 1 + xStep])
//   const spline = new Spline(xValues, arrContinued)
//   return u => spline.at(u * arr.length + 2)
// }
//
// export const resampleCubic = (newLen, arr) => {
//   const spline = new Spline(
//     timesF(x => x, arr.length),
//     arr
//   )
//   return timesF(x => spline.at(x), newLen)
// }
//
// export const resampleCubicCircular = (newLen, arr) => {
//   const arrContinued = flatten([takeLast(2, arr), arr, take(2, arr)])
//   const xStep = 1 / arr.length
//   const xValues = flatten([-(2 * xStep), -xStep, timesF(x => x, arr.length), 1, 1 + xStep])
//   const spline = new Spline(xValues, arrContinued)
//   return timesF(x => spline.at(x), newLen)
// }

export const oversampleInterpolated = _c((extraSamples, arr) => {
  if (!Array.isArray(arr)) throw 'interpolate second argument is not an array.'
  return flatten(arr.map((x, i) => (i == arr.length - 1 ? [] : linearArr(x, arr[i + 1], extraSamples))))
})

export const downsample = _c((div, arr) => {
  const newLen = Math.floor(arr.length / div)
  // if (!Number.isInteger(newLen)) throw `array of ${arr.length} not integer divisable by ${div}`
  return times(i => arr[Math.floor(i * div)], newLen)
})

// these two function require integer shift inputs
export const octaveUpSample = _c((arr, octaveShift, x) => circularRead(arr, 2 ** (octaveShift - 1) * x))
export const harmonicUpSample = _c((arr, harmonicShift, x) => circularRead(arr, harmonicShift * x))

export const sumProp = _c((prop, arr) => {
  return sum(pluck(prop, arr))
})

export const arrayLens = _c((f, prop, arr) => {
  return map(({ ...x }) => {
    x[prop] = f(x[prop])
    return x
  }, arr)
})

export const arrayLensF = _c((f, prop, arr) => arrayLens(() => f(), prop, arr))

export const buildRecursive = _c((f, numIncrements, startData) => {
  let data = startData
  return concat(
    [data],
    timesF((x, i) => {
      data = f([...data], x, i)
      return data
    }, numIncrements - 1)
  )
})

const mod = _c((n, m) => ((n % m) + m) % m)

export const circularRead = _c((arr, index) => arr[mod(index, arr.length)])
export const zeroBoundRead = _c((arr, index) => (math.isBetween(0, arr.length, index) ? arr[index] : 0))
export const paddedRead = _c((x, arr, index) => (math.isBetween(0, arr.length, index) ? arr[index] : x))

export const shuffle = ([...a]) => {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function* chunks(arr, n) {
  for (let i = 0; i < arr.length; i += n) {
    yield arr.slice(i, i + n)
  }
}

export const unInterleave = arr => [...keepNthIndexes(2, arr), ...removeNthIndexes(2, arr)]
export const unInterleaveV = compose(transpose, unInterleave, transpose)
export const unInterleaveN = _c((n, arr) => unnest(transpose([...chunks(arr, n)])))

export const overwriteArr = _c((index, target, source) => [
  ...slice(0, index, target),
  ...take(target.length - index, source),
  ...slice(index + source.length, Infinity, target)
])

export const overwriteArrBlock2D = _c((xStart, yStart, target, source) => {
  return mapI((row, i) => {
    if (i >= yStart && i < yStart + source.length && i - yStart < source.length) {
      return overwriteArr(xStart, row, source[i - yStart])
    } else return row
  }, target)
})

export const slice2D = _c((xStart, yStart, xEnd, yEnd, arr) => {
  return map(
    row => {
      return slice(xStart, xEnd + 1, row)
    },
    filterI((row, i) => i >= yStart && i <= yEnd, arr)
  )
})

export const swapArrBlock2D = _c((x1, y1, x2, y2, xlen, ylen, arr) => {
  const rect1 = slice2D(x1, y1, x1 + xlen, y1 + ylen, arr)
  const rect2 = slice2D(x2, y2, x2 + xlen, y2 + ylen, arr)
  let out = overwriteArrBlock2D(x1, y1, arr, rect2)
  out = overwriteArrBlock2D(x2, y2, out, rect1)
  return out
})

export const splitUpdate = _c((f, g, x, arr) => [...f(take(x, arr)), ...g(takeLast(x, arr))])
// console.log(
//   swapArrBlock2D(0, 0, 2, 1, 1, 2, [
//     ['0,0', '1,0', '2,0'],
//     ['0,1', '1,1', '2,1'],
//     ['0,2', '1,2', '2,2']
//   ])
// )

export const multiplySubstring = _c((position, operator, [...target]) => {
  for (let i = position; i < position + operator.length; i++) {
    target[i] *= operator[i - position]
  }
  return target
})

export const addSubstring = _c((position, operator, [...target]) => {
  for (let i = position; i < position + operator.length; i++) {
    target[i] += operator[i - position]
  }
  return target
})

export const mirror = target => concat(target, reverse(init(target)))
export const duplicate = target => concat(target, target)

export const loopDeclick = _c((width, [...target]) => {
  const distBetween = target[target.length - 1] - target[0]
  // const wedge = timesF(x => -1 * distBetween * x + distBetween, width)
  const wedge = timesF(x => distBetween * (0.5 * Math.cos(Math.PI * x) + 0.5), width)
  return addSubstring(0, wedge, target)
})

export const _window = _c((f, width, [...target]) => {
  const operator = timesF(f, width)
  target = multiplySubstring(0, operator, target)
  target = multiplySubstring(target.length - operator.length, reverse(operator), target)
  return target
})

export const _windowFraction = _c((f, width, target) => {
  return _window(f, width * target.length, target)
})

export const window = {
  custom: _window,
  linear: _window(x => x),
  sin: _window(x => Math.sin((Math.PI / 2) * x)),
  cubic: _window(x => -2 * (x * x * x) + 3 * (x * x))
}

export const derivativeFast = _c(mapWithNeighborsCirc)(([_, a, b]) => b - a)

export const maximumValIndex = arr => reduceI((acc, x, i) => (acc.x < x ? { x, i } : acc), { x: -bignum, i: -1 }, arr).i

export const zeroCrossingIndexes = arr => {
  const zCTest = (a, b) => (a >= 0 && b < 0) || (a > 0 && b <= 0) || (a <= 0 && b > 0) || (a < 0 && b >= 0)
  const out = filter(i => {
    if (i == 0) {
      return zCTest(arr[arr.length - 1], arr[0]) || zCTest(arr[0], arr[1])
    }
    const cur = circularRead(arr, i)
    const next = circularRead(arr, i + 1)
    return zCTest(cur, next)
  }, range(0, arr.length))
  if (out.length < 2) return [0, arr.length - 1]
  return out
}

// used for normalize algo
const bignum = 1e100

export const normalize = arr => {
  const max = reduce(rmax, -bignum, arr)
  const min = -reduce(rmin, bignum, arr)
  const co = min > max ? 1 / min : 1 / max
  return map(multiply(co), arr)
}

export const normalizeMaxOnly = arr => {
  const max = reduce(rmax, -bignum, arr)
  const min = -reduce(rmin, bignum, arr)
  const co = min > max ? 1 / min : 1 / max
  return co < 1 ? map(multiply(co), arr) : arr
}

export const removeBias = arr => {
  const max = reduce(rmax, -bignum, arr)
  const min = reduce(rmin, bignum, arr)
  const height = max - min
  const midpoint = min + height / 2
  const delta = 0 - midpoint
  return map(add(delta), arr)
}

export const refit = pipe(removeBias, normalize)

export const blurring = _c((amt, arr) => {
  const size = Math.floor(arr.length * amt)
  const indexes = range(-size + 1, size)
  const scalers = times(i => sech(i), size)
  const divider = sum(scalers) * 2 - 1
  return mapI((z, i) => {
    const total =
      sum(
        map(x => {
          const val = circularRead(arr, x + i) * scalers[Math.abs(x)]
          return val
        }, indexes)
      ) / divider
    return total
  }, arr)
})

// this is a custom partial application function generator that gives you
// many options in how to call it.  It was created to wrap x => pipe(somefunc,x,someOtherFunc) functions,
// because the result of pipe is not curried.
// given a function f that takes the form f([op1,op2,op3])(data<Array>),
// where opN are unary functions that take and return an array
// you can now call f (after wrapping it with makeSuperPipe) using the following forms:
// f(op1, data)
// f(op1)(data)
// f([op1])(data)
// f(op1, op2, <opN>, data)
// f(op1, op2, <opN>)(data)
// f([op1, op2, <opN>], data)
export const makeSuperPipe = f => (...a) => {
  if (a.length > 1) {
    if (type(head(a)) == 'Array') {
      if (type(last(a)) == 'Array') {
        return f(head(a))(last(a))
      }
      return f(a)
    }
    return type(last(a)) == 'Array' ? f(init(a))(last(a)) : f(a)
  }
  return type(head(a)) == 'Array' ? f(head(a)) : f(a)
}
makeSuperPipe.noCurry = true

export const cZipWith = _c((f, h, x) => {
  return times(i => {
    let xChunk = times(j => {
      const n = i - j
      return n < 0 ? 0 : x[n] // set x(n) to zero if it's before the start of x
    }, h.length)
    return f(h, xChunk, h.length)
  }, x.length)
})

export const sumZdim = arr3d => {
  if (arr3d.length < 1) return arr3d[0]
  return times2D(([x, y]) => sum(times(z => arr3d[z][y][x], arr3d.length)), arr3d[0][0].length, arr3d[0].length)
}

export const crop2D = _c((w, h, arr) => map(take(w), take(h, arr)))

// module.exports = autoCurry(module.exports)
