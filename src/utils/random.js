/**
 * Random number generators
 * @module random
 */

import MersenneTwister from 'mersenne-twister'
import { sumProp } from './array.js'
import { sum, curry as _c, times } from 'ramda'
import { makeNoise2D, makeNoise3D, makeNoise4D } from 'open-simplex-noise'
// import sentencer from 'sentencer'
import * as math from './math.js'

const generator = new MersenneTwister()

/**
 * Generate a random number (of type double). Uses the mersenne twister algorithm (flatter distribution than Math.random)
 * @function random
 * @param {number} [max=1] - The ceiling of the random number.  The min is 0. For a range of 0 to 1, you can omit this param.
 * @returns {number} - The random double precision number.
 * @example
 * random()
 * -> 0.38571237338
 * random(3)
 * -> 1.85937497374
 */
export const random = (max = 1.0) => {
  return generator.random() * max
}

/**
 * Generate a random number (of type integer). Uses the mersenne twister algorithm (flatter distribution than Math.random)
 * Defaults to a choice between 0 and 1 (coin flip).
 * @function randomI
 * @param {number} [max=2] - The ceiling of the random number (exclusive).  The min is 0. For a range of 0 to 1, you can omit this param.
 * @returns {number} - The random integer number.
 * @example
 * randomI()
 * -> 1
 * randomI(3)
 * -> 2
 */
export const randomI = (max = 2.0) => {
  return Math.floor(generator.random() * max)
}

/**
 * Generate a random number between given bounds (of type double). Uses the mersenne twister algorithm (flatter distribution than Math.random)
 * Defaults to a range between -1 and 1 (coin flip). Optionally accepts arguments in the form of an array.
 * @function randomRange
 * @param {number} [min=-1] - Minimum value the random number can be (inclusive). Can be an array specifying the min and max.
 * @param {number} [max=1] - Maximum value the random number can be (exclusive).
 * @returns {number} - The random double precision number between specified bounds.
 * @example
 * randomRange()
 * -> 0.80085384721
 * randomRange(-1, 1)
 * -> 0.80085384721
 * randomRange([-200, 400])
 * -> 43.8957302727
 */
export const randomRange = (min = -1, max = 1) => {
  if (Array.isArray(min)) return randomRange(min[0], min[1])
  return min + random(max - min)
}

/**
 * Generate a random number between given bounds (of type integer). Uses the mersenne twister algorithm (flatter distribution than Math.random)
 * Defaults to a range between -1 and 2; a choice between -1, 0, and 1. Optionally accepts arguments in the form of an array.
 * @function randomRangeI
 * @param {number} [min=-1] - Minimum value the random number can be (inclusive). Can be an array specifying the min and max.
 * @param {number} [max=2] - Maximum value the random number can be (exclusive).
 * @returns {number} - The random integer number between specified bounds.
 * @example
 * randomRange()
 * -> 0
 * randomRange(-1, 2)
 * -> 0
 * randomRange([-200, 400])
 * -> 43
 */
export const randomRangeI = (min = -1, max = 2) => {
  if (Array.isArray(min)) return randomRangeI(min[0], min[1])
  return Math.floor(randomRange(min, max))
}

/**
 * Generate a random boolean value (either `true` or `false`). Uses the mersenne twister algorithm (flatter distribution than Math.random)
 * Defaults to a 50/50 chance to be `true` or `false`
 * @function randomBoolean
 * @param {number} [probability=0.5] - Probability that `true` will be the outcome. Accepts values between 0.0 and 1.0
 * @returns {number} - The random boolean value.
 * @example
 * randomBoolean() // A 50% chance to be true.
 * -> true
 * randomBoolean(0.1) // A 10% chance to be true.
 * -> false
 */
export const randomBoolean = (probability = 0.5) => {
  return random() < probability
}

/**
 * Applied to a function, has a chance to either return the function, or return the identity function (returning the first argument)
 * Defaults to a 50/50 chance to be applied or identity. Designed to work with unary functions, where the return value is of the same type as the input value.
 * @function randomApply
 * @param f {function} - the function to transform.  Should be a unary function with type signature a -> a.
 * @param {number} [probability=0.5] - Probability that the function supplied will be returned. Accepts values between 0.0 and 1.0
 * @returns {number} - Either the function or the identity function.
 * @example
 * let add1 = x => x + 1
 * randomApply(add1)(1)
 * -> 1 or 2 (with a 50% chance)
 *
 * randomApply(reverse, 0.1)([1,2,3])
 * -> [1,2,3] or [3,2,1] (with a 10% chance to be the latter option)
 */
export const randomApply = (f, probability = 0.5) => {
  return randomBoolean(probability) ? f : x => x
}

/**
 * Generate a random number within a standard distribution. Uses the mersenne twister and box-muller algorithms (flatter distribution than Math.random)
 * Defaults to a range between 0 and 1.
 * @function randomNormal
 * @param {number} [min=0] - Minimum value the random number can be (exclusive).
 * @param {number} [max=1] - Maximum value the random number can be (exclusive).
 * @param {number} [skew=1] - Shifts the mean value. A skew value of 1 puts the mean half way between the min and max. Increasing the skew moves it towards the max, and vice versa.
 * @returns {number} - The random double precision number between specified bounds.
 * @example
 * randomNormal()
 * -> 0.42859684757
 * randomNormal(-1, 1)
 * -> -0.23459835473
 * randomNormal(-1, 1, 5)
 * -> 0.93459835473
 */
export const randomNormal = (min = 0, max = 1, skew = 1) => {
  let u = 0,
    v = 0
  while (u === 0) u = random() //Converting [0,1) to (0,1)
  while (v === 0) v = random()
  let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v)
  num = num / 10.0 + 0.5 // Translate to 0 -> 1
  if (num > 1 || num < 0) num = randomNormal(min, max, skew) // resample between 0 and 1 if out of range
  num = Math.pow(num, skew) // Skew
  num *= max - min // Stretch to fill range
  num += min // offset to min
  return num
}

/**
 * Chooses a value from an array of objects, each should posses a number property of `p`.  The higher the p value is, the more likely the object will be chosen.
 * The p values need not all add to 1, they can be in any range. This function will normalise all the p values internally.
 * @function pNextItem
 * @param pMap {array} -
 * @returns {type} - rdesc
 * @example
 *
 * ->
 */
export const pNextItem = pMap => {
  const sumOfAllPs = sumProp('p', pMap)
  let pick = random(sumOfAllPs)
  return pMap[
    pMap.reduce((accum, item, i) => {
      pick -= item.p
      return accum === -1 && pick < 0 ? i : accum
    }, -1)
  ]
}

/**
 * A simplex noise function in one dimension. Similar to perlin noise.
 * @function simplex1D
 * @param x {number} - input number.
 * @returns {number} - Output value between -1 and 1, continious for each value of x.
 * @example
 * simplex1D(0.45)
 * -> -0.345573029847
 */
export const simplex1D = _c(makeNoise2D(Date.now() * random()))(random(1e10))

/**
 * A simplex noise function in two dimensions. Similar to perlin noise.
 * @function simplex2D
 * @param x {number} - input number for the x axis.
 * @param y {number} - input number for the y axis.
 * @returns {number} - Output value between -1 and 1, continious along the plane for each value of (x,y)
 * @example
 * simplex2D(0.45, 3945.24)
 * -> 0.609283848349
 */
export const simplex2D = _c(makeNoise2D(Date.now() * random()))

/**
 * A simplex noise function in three dimensions. Similar to perlin noise.
 * @function simplex3D
 * @param x {number} - input number for the x axis.
 * @param y {number} - input number for the y axis.
 * @param z {number} - input number for the z axis.
 * @returns {number} - Output value between -1 and 1, continious in the space for each value of (x,y,z)
 * @example
 * simplex3D(0.45, 3945.24, -23.534)
 * -> 0.11389349745
 */
export const simplex3D = _c(makeNoise3D(Date.now() * random()))

/**
 * A simplex noise function in four dimensions. Similar to perlin noise.
 * @function simplex4D
 * @param x {number} - input number for the x axis.
 * @param y {number} - input number for the y axis.
 * @param z {number} - input number for the z axis.
 * @param w {number} - input number for the w axis.
 * @returns {number} - Output value between -1 and 1, continious in the space for each value of (x,y,z,w)
 * @example
 * simplex3D(0.45, 3945.24, -23.534, 333)
 * -> 0.12334573924
 */
export const simplex4D = _c(makeNoise4D(Date.now() * random()))

/**
 * Create a new instance of a simplex random number function with a different space.
 * @function newSimplex1D
 * @returns {type} - a new function with it's own internal state that can define a simplex line.
 * @example
 * const mySimplex = newSimplex1D()
 * mySimplex(200)
 * -> 0.2343535353
 */
export const newSimplex1D = () => _c(makeNoise2D(Date.now() * random()))(random(1e10))

/**
 * Create a new instance of a simplex random number function with a different space.
 * @function newSimplex2D
 * @returns {type} - a new function with it's own internal state that can define a simplex line.
 * @example
 * const mySimplex = newSimplex2D()
 * mySimplex(3,7)
 * -> -0.934573723273
 */
export const newSimplex2D = () => _c(makeNoise2D(Date.now() * random()))

/**
 * Create a new instance of a simplex random number function with a different space.
 * @function newSimplex3D
 * @returns {type} - a new function with it's own internal state that can define a simplex line.
 * @example
 * const mySimplex = newSimplex3D()
 * mySimplex(3,7)
 * -> -0.854920750237
 */
export const newSimplex3D = () => _c(makeNoise3D(Date.now() * random()))

/**
 * Create a new instance of a simplex random number function with a different space.
 * @function newSimplex4D
 * @returns {type} - a new function with it's own internal state that can define a simplex line.
 * @example
 * const mySimplex = newSimplex4D()
 * mySimplex(3,7,-1999,9)
 * -> -0.374738272465
 */
export const newSimplex4D = () => _c(makeNoise4D(Date.now() * random()))

const fractalSimplex2D = _c((sim, octaves, x, y) => {
  const octs = times(o => {
    const freq = 2 ** o
    return sim(math.tau * freq * x, math.tau * freq * y) * (1 / freq)
  }, octaves)
  return sum(octs)
})

/**
 * Create a new simplex2D object that has a fractal nature due to the addition of octave based additions on top of the original simplex function.
 * @function newFractalSimplex2D
 * @param octaves {number} - the number of octaves to add
 * @param x {number} - input number for the x axis.
 * @param y {number} - input number for the y axis.
 * @returns {number} - Output value between -1 and 1, continious along the plane for each value of (x,y)
 * @example
 * const myFractal2D = newFractalSimplex2D()
 * myFractal2D(4, 0.45, 3945.24)
 * -> 0.609283848349
 */
export const newFractalSimplex2D = () => {
  const my_simplex = newSimplex2D()
  return fractalSimplex2D(my_simplex)
}
/**
 * An LFO that features a set of sine waves added together.
 * @function additiveLFO
 * @param partials {array} - an array that specifies the sine waves that make up the LFO. Specified by `[[amp, freq, phase],...]`
 * @param x {number} - input number for the x axis.
 * @returns {type} - the output of the summed sine waves at given x position.  the LFO's are unipolar and vary from 0 to 1 (normalised).
 * @example
 * additiveLFO([[1,1,0], [0.4,2.345, 0.6]], 3.4)
 * -> 0.5439489348
 * const myLFO = additiveLFO([[1,1,0], [0.4,2.345, 0.6]]) // partially apply arguments so the sine waves are pre-defined.
 * myLFO(0.3)  // supply one or more x values.
 * -> 0.3469485874
 */
export const additiveLFO = (partials, x) => {
  // partials is an array with each element featuring [amp, freq, phase]
  const totalAmp = partials.reduce((acc, p) => acc + p[0], 0)
  return partials.reduce((acc, [amp, freq, phase]) => {
    const out = acc + (amp * math.sinUni(freq * x + phase)) / totalAmp
    return out
  }, 0)
}

/**
 * Similar to the `additiveLFO`, but each partial is a phase modulation of the partial before it.  Consider it as a FM synthesizer with one operator with a series of modulators.
 * @function randPMLFO
 * @param partials {array} - an array that specifies the sine waves that make up the LFO. Specified by `[[amp, freq, phase],...]`
 * @param x {number} - input number for the x axis.
 * @returns {number} - the resulting amplitude at point x.  Unipolar and varying from 0 to 1.
 * @example
 * randPMLFO([[1,1,0], [0.4,2.345, 0.6]], 3.4)
 * -> 0.5439489348
 * const myLFO = randPMLFO([[1,1,0], [0.4,2.345, 0.6]]) // partially apply arguments so the sine waves are pre-defined.
 * myLFO(0.3)  // supply one or more x values.
 * -> 0.3469485874
 */
export const randPMLFO = (partials, x) => {
  const f = (i, _x) => {
    const amp = partials[i][0]
    const freq = partials[i][1]
    let phase = partials[i][2]
    i++
    if (i < partials.length) phase += f(i, _x)
    return amp * math.sinUni(freq * _x + phase)
  }
  return f(0, x)
}

/**
 * A meta function of `randPMLFO` that returns the average of a set of `ramdPMLFO` results, to 'smooth out' some of the chaos in the system.
 * Quite computationally expensive.
 * @function avgPMLFO
 * @param partials {array} - An array of arrays of partial definitions.  See `randPMLFO` to learn how to provide them.
 * @param x {number} - input number for the x axis.
 * @returns {number} - the resulting amplitude at point x.  Unipolar and varying from 0 to 1.
 * @example
 * avgPMLFO([[[1,1,0], [0.4,2.345, 0.6]],[[1,2,0.3],[3.13,7.3,3445]]], 3.4)
 * -> 0.5439489348
 * const myLFO = avgPMLFO([[[1,1,0], [0.4,2.345, 0.6]],[[1,2,0.3],[3.13,7.3,3445]]]) // partially apply arguments so the sine waves are pre-defined.
 * myLFO(0.3)  // supply one or more x values.
 * -> 0.3469485874
 */
export const avgPMLFO = _c((partialCollection, x) => {
  const collectionOfSubSamples = partialCollection.map(partials => randPMLFO(partials, x))
  const avg = (2 * sum(collectionOfSubSamples)) / collectionOfSubSamples.length
  return avg
})

/**
 * A factory function that programatically creates a random set of partials for `avgPMLFO`, with a parameter that defines how bumpy the resulting waveform will be.
 * Essentially a random low frequency noise function with a different character to `simplex1D`. It is far less efficiant than `simplex1D`, but provides a more chaotic result.
 *
 * This function was originally created to create interesting shapes for melody lines in stochastic midi file generation.
 * @function makeAvgPMLFOFunc
 * @param {number} [bumpiness=2] - Controls the frequency spread of the partials in the system.  It is the factor between the lowest possible and highest possible frequencies. So a value of 2 will mean the highest possible freq is double the lowest.  Higher bumpiness will include a wider range of possible frequencies.
 * @param {number} [numPartialsInASet=100] - Number of partials (sine waves) in a `randPMLFO` in the system.
 * @param {number} [numSets=32] - Number of sets in the `avgPMLFO` in the system. Increase the computational time by a factor of the `numPartialsInASet` (watch out!).
 * @returns {function} - the resulting `avgPMLFO` with the partial data randomly generated and provided.
 * @example
 *
 * ->
 */
export const makeAvgPMLFOFunc = (bumpiness = 2, numPartialsInASet = 100, numSets = 32) => {
  const lowestFreq = 0.01
  const highestFreq = lowestFreq * bumpiness
  const partialCollection = times(() => {
    const oneSetOfPartials = times(i => {
      // const amp = randomRange(0.5, 1)
      const amp = 1 / (i + 1)
      const freq = randomRange(lowestFreq, highestFreq)
      const phase = randomRange(0, 1)
      return [amp, freq, phase]
    }, numPartialsInASet)
    return oneSetOfPartials
  }, numSets)
  return avgPMLFO(partialCollection)
}

/**
 * Pick a random item in an array. Does not remember previous picks, so can chose the same item multiple times.
 * @function pickRandomInArray
 * @param arr {array} - Array to choose item from.
 * @returns {object} - the randomly chosen item.
 * @example
 *
 * ->
 */
export const pickRandomInArray = arr => arr[randomI(arr.length)]

// const makeDateForFilename = () => {
//   const c = new Date()
//   return `${c.getFullYear() - 2000}${(c.getMonth() + 1).toString().padStart(2, '0')}${c
//     .getDate()
//     .toString()
//     .padStart(2, '0')}${c.getHours().toString().padStart(2, '0')}${c.getMinutes().toString().padStart(2, '0')}`
// }
//
// /**
//  * Makes a unique filename for a generated file.  The string contains the current date and time, as well as a random adjective and a random noun.
//  *
//  * The date is in the format  YYMMDDHHMM
//  * the words come from the open source library 'sentencer'.
//  * @function randomFileName
//  * @returns {string} - the filename string.
//  * @example
//  * randomFileName()
//  * -> 2107171437_unspun-delivery
//  * randomFileName()
//  * -> 2107171811_lusty-tub
//  */
// export const randomFileName = () => {
//   return `${makeDateForFilename()}_${sentencer.make('{{ adjective }}-{{ noun }}')}`
// }

export default random
