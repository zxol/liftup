/**
 * A collection of math functions to suppliment js Math
 * @module math
 */

import { curry as _c, flip, times, map as rmap, range } from 'ramda'
import { sech } from 'mathjs'
import { autoCurry } from './functional.js'
import * as complex from './complex.js'

/**
 * maps a number from one range (origin) to another (destination)
 * not to be confused with the iterator function map()
 * @function map
 * @param oldMin {number} - starting bound for the origin range
 * @param oldMax {number} - ending bound from the origin range
 * @param newMin {number} - starting bound for the destination range
 * @param newMax {number} - ending bound from the destination range
 * @param x {Number} - the number to remap
 * @returns {number} remapped result
 * @example
 * map(0, 1, 0, 100, 0.5)
 * -> 50
 */
export const _map = _c((oldMin, oldMax, newMin, newMax, x) => {
  const unitValue = (x - oldMin) / (oldMax - oldMin)
  return newMin + unitValue * (newMax - newMin)
})

/**
 * Restricts a number to within a given range.
 * @example
 * clamp(0, 1, 1.5)
 * -> 1
 * @function clamp
 * @param {number} min - min value in range.
 * @param {number} max - max value in range.
 * @param {number} x - number to clamp.
 * @returns {number} clamped number
 */
export const clamp = _c(function (min, max, x) {
  if (x <= min) return min
  if (x >= max) return max
  return x
})

/**
 * Restricts a number to within 0 - 1.
 * @example
 * uClamp(-1.5)
 * -> 0
 * @function uClamp
 * @param {number} x - number to clamp.
 * @returns {number} clamped number
 */
export const uClamp = _c(clamp)(0, 1)

/**
 * maps a number from one range (origin) to another (destination), clamping the result within the range
 * not to be confused with the iterator function `map()`
 * @function mapClamp
 * @param oldMin {number} - starting bound for the origin range
 * @param oldMax {number} - ending bound from the origin range
 * @param newMin {number} - starting bound for the destination range
 * @param newMax {number} - ending bound from the destination range
 * @param x {number} - the number to remap
 * @returns {number} remapped and clamped result
 * @example
 * mapClamp(0, 1, 0, 100, 1.3333)
 * -> 100
 */
export const mapClamp = _c((oldMin, oldMax, newMin, newMax, x) => {
  if (x <= oldMin) return newMin
  if (x >= oldMax) return newMax
  return _map(oldMin, oldMax, newMin, newMax, x)
})

/**
 * maps a number from one range (origin) to another (destination), applying a exp to log curve shape.
 * @function mapCurve
 * @param oldMin {Number} - starting bound for the origin range.
 * @param oldMax {Number} - ending bound from the origin range.
 * @param newMin {Number} - starting bound for the destination range.
 * @param newMax {Number} - ending bound from the destination range.
 * @param shape {Number} - apply a curve to the map shape. 0.5 = linear, 0.75 = log, 0.25 = exponential.
 * @param x {number} - the number to remap.
 * @returns {number} remapped result.
 * @example
 * mapCurve(0, 1, 0, 100, 1.3333)
 * -> 100
 */
export const mapCurve = _c((oldMin, oldMax, newMin, newMax, shape, x) => {
  const unitValue = (x - oldMin) / (oldMax - oldMin)
  const mycurve = cx => cx / (cx + (1 - 1 / shape) * (cx - 1))
  return newMin + mycurve(unitValue) * (newMax - newMin)
})

/**
 * Checks to see if a given number lies between a range.
 * @function isBetween
 * @param lower {number} - the lower bound of the range (inclusive).
 * @param upper {number} - the upper bound of the range (exclusive).
 * @param x {number} - the number to check.
 * @returns {boolean} result.
 * @example
 * isBetween(0, 10, 3)
 * -> true
 * isBetween(0, 1, 3)
 * -> false
 */
export const isBetween = _c((lower, upper, x) => x >= lower && x < upper)

/**
 * Checks to see if a given number is within a radius of another.
 * @function isWithin
 * @param radius {number} - Radius of the check. (acceptable error distance)
 * @param target {number} - Target number.
 * @param x {number} - Number to check.
 * @returns {boolean} result.
 * @example
 * isWithin(1e-2, 100, 100.001)
 * -> true
 * isWithin(1e-5, 100, 100.001)
 * -> false
 */
export const isWithin = _c((radius, target, x) => x >= target - radius && x < target + radius)

/**
 * checks if a number is even (only integer values).
 * @function isEven
 * @param x {number} - the number to check.
 * @returns {boolean} result.
 * @example
 * isEven(4)
 * -> true
 */
export const isEven = x => x % 2 === 0

/**
 * checks if a number is odd (only integer values).
 * @function isOdd
 * @param x {number} - the number to check.
 * @returns {boolean} result.
 * @example
 * isEven(4)
 * -> false
 */
export const isOdd = x => x % 2 === 1

/**
 * Round a number down to the nearest integer.
 * @function flr
 * @param x {number} - the number to round down.
 * @returns {number} rounded number.
 * @example
 * flr(4.9)
 * -> 4.9
 */
export const flr = Math.floor

/**
 * Round a number up to the nearest integer.
 * @function ceil
 * @param x {number} - the number to round up.
 * @returns {number} rounded number.
 * @example
 * ceil(4.9)
 * -> 5
 */
export const ceil = Math.ceil

/**
 * Round a number to the nearest integer.
 * @function round
 * @param x {number} - the number to round.
 * @returns {number} rounded number.
 * @example
 * round(4.9)
 * -> 5
 */
export const round = Math.round

/**
 * Calculate the square root of a number.
 * @function sqrt
 * @param x {number} - the number to square root.
 * @returns {number} Square root.
 * @example
 * sqrt(9)
 * -> 3
 */
export const sqrt = Math.sqrt

/**
 * checks two numbers to see if the signs match.
 * @function sameSigns
 * @param a {number} - first number.
 * @param b {number} - second number.
 * @returns {boolean} boolean result.
 * @example
 * sameSigns(-1, 1)
 * -> false
 * sameSigns(-1, -0.1)
 * -> true
 */
export const sameSigns = _c((a, b) => a > 0 != b > 0)

/**
 * checks two numbers to see if the signs are opposite.
 * @function oppositeSigns
 * @param a {number} - first number.
 * @param b {number} - second number.
 * @returns {boolean} boolean result.
 * @example
 * oppositeSigns(-1, 1)
 * -> true
 * oppositeSigns(-1, -0.1)
 * -> false
 */
export const oppositeSigns = _c((a, b) => a > 0 != b > 0)

/**
 * remaps a number from 0 to 1 onto a curve that can vary from exponential to logarithmic.
 * @function curve
 * @param shape {number} - determines the shape of the curve. 0.25 -> exponential, 0.5 -> linear, 0.75 -> logarithmic. The number determines where 0.5 will map to.
 * @param x {number} - the number to remap.
 * @returns {number} - the remapped number.
 * @example
 * curve(0.5, 0.5)
 * -> 0.5
 * curve(0.25, 0.5)
 * -> 0.25
 * curve(0.75, 0.5)
 * -> 0.75
 */
export const curve = _c((shape, x) => x / (x + (1 - 1 / shape) * (x - 1)))

/**
 * returns the true modulo of a number (differs from js' % operator which is the remainder operator)
 * @function mod
 * @param a {number} - the dividend.
 * @param n {number} - the divisor.
 * @returns {number} - the remainder.
 * @example
 * mod(1.5, 1)
 * -> 0.5
 * mod(-0.9, 1)
 * -> 0.1
 */
export const mod = _c((a, n) => ((a % n) + n) % n)

/**
 * Sums two numbers.
 * @function add
 * @param a {number} - first number.
 * @param b {number} - second number.
 * @returns {number} - the sum.
 * @example
 * add(1,2)
 * -> 3
 */
export const add = _c((a, b) => a + b)

/**
 * Returns the multiplication product of two numbers.
 * @function mul
 * @param a {number} - first number.
 * @param b {number} - second number.
 * @returns {number} - the product.
 * @example
 * mul(3,2)
 * -> 6
 */
export const mul = _c((a, b) => a * b)

/**
 * Subtracts a number from another number.
 * @function sub
 * @param a {number} - first number.
 * @param b {number} - second number.
 * @returns {number} - the subtracted result.
 * @example
 * sub(3,2)
 * -> 1
 */
export const sub = _c((a, b) => a - b)

/**
 * Divides a number into another number.
 * @function div
 * @param a {number} - dividend.
 * @param b {number} - divisor.
 * @returns {number} - the quotient.
 * @example
 * div(3,6)
 * -> 0.5
 */
export const div = _c((a, b) => a / b)

/**
 * Midpoint between two numbers
 * @function mid
 * @param a {number} - First number.
 * @param b {number} - Second number.
 * @returns {number} - Average.
 * @example
 * avg(3,6)
 * -> 4.5
 */
export const mid = _c((a, b) => 0.5 * (a + b))

/**
 * Maximum value of two numbers
 * @function max
 * @param a {number} - First number.
 * @param b {number} - Second number.
 * @returns {number} - Average.
 * @example
 * max(3,6)
 * -> 6
 */
export const max = _c((a, b) => Math.max(a, b))

/**
 * Minimum value of two numbers
 * @function min
 * @param a {number} - First number.
 * @param b {number} - Second number.
 * @returns {number} - Average.
 * @example
 * min(3,6)
 * -> 3
 */
export const min = _c((a, b) => Math.min(a, b))

/**
 * Mathematical constant PI (3.141..)
 * @const {number} - pi
 */
export const pi = Math.PI

/**
 * Mathematical constant TAU, or 2pi (2 * 3.141..)
 * @const {number} - Tau
 */
export const tau = 2 * Math.PI

/**
 * Mathematical constant √2
 * @const {number} - r2
 */
export const r2 = Math.sqrt(2)

/**
 * Mathematical constant 1/√2
 * @const {number} - r2recip
 */
export const r2recip = 1 / Math.sqrt(2)
export const r2r = r2recip

/**
 * Mathematical constant PI over 4 (3.141../4)
 * @const {number} - quarterpi
 */
export const quarterpi = Math.PI / 4
export const qpi = quarterpi

/**
 * Mathematical constant PI over 2 (3.141../2)
 * @const {number} - halfpi
 */
export const halfpi = Math.PI / 2
export const hpi = halfpi

/**
 * Mathematical constant 3 * PI / 2 (3 * 3.141../2)
 * @const {number} - threehalfpi
 */
export const threehalfpi = (3 * Math.PI) / 2
export const h3pi = threehalfpi
/**
 * Square root of 2, pythagoras' constant.
 * @const {number} - pythag
 */
export const pythag = Math.sqrt(2)

/**
 * The golden ratio.  The ratio of a pentagon's diagonal to it's side.
 * @const {number} - phi
 */
export const phi = (1 + sqrt(5)) / 2

/**
 * The conjugate of the golden ratio, the silver ratio.
 * @const {number} - phi
 */
export const Phi = 1 / phi

/**
 * negates (flips sign) of a number
 * @function neg
 * @param x {number} - Input number.
 * @returns {number} - flipped sign of x
 * @example
 * neg(0.5)
 * -> -0.5
 */
export const neg = x => -x

/**
 * Trigonometric function cosine using tau units, instead of radians. (0 to 1 is one cycle)
 * @function cos
 * @param x {number} - Input number.
 * @returns {number} - Cosine value at x.
 * @example
 * cos(0.5)
 * -> -1
 */
export const cos = x => Math.cos(tau * x)

/**
 * Unipolar (output 0 to 1) trigonometric function cosine using tau units, instead of radians. (0 to 1 is one cycle)
 * @function cosUni
 * @param x {number} - Input number.
 * @returns {number} - Unipolar (0 to 1) cosine value at x.
 * @example
 * cosUni(0.5)
 * -> -1
 */
export const cosUni = x => (1 + cos(x)) * 0.5

/**
 * Trigonometric function sine using tau units, instead of radians. (0 to 1 is one cycle)
 * @function sin
 * @param x {number} - Input number.
 * @returns {number} - Sine value at x.
 * @example
 * sin(0.5)
 * -> 0
 */
export const sin = x => Math.sin(tau * x)

/**
 * Unipolar (output 0 to 1) trigonometric function sine using tau units, instead of radians. (0 to 1 is one cycle)
 * @function sinUni
 * @param x {number} - Input number.
 * @returns {number} - unipolar (0 to 1) sine value at x.
 * @example
 * sinUni(0.5)
 * -> 0.5
 */
export const sinUni = x => (1 + sin(x)) * 0.5

/**
 * Trigonometric function tangent using tau units, instead of radians. (0 to 1 is one cycle)
 * @function tan
 * @param x {number} - Input number.
 * @returns {number} - tangent value at x.
 * @example
 * tan(0.5)
 * -> 0
 */
export const tan = x => Math.tan(tau * x)

/**
 * Trigonometric function tangent using tau units, instead of radians. (0 to 1 is one cycle)
 * @function atan2
 * @param x {number} - Input number.
 * @param y {number} - Input number.
 * @returns {number} - angle in radians
 * @example
 * atan2(1,1)
 * -> pi/4
 */
export const atan2 = _c(Math.atan2)

/**
 * Periodic triangle wave function using tau units, instead of radians. (0 to 1 is one cycle)
 * @function tri
 * @param x {number} - Input number.
 * @returns {number} - Triangle wave value at x.  Output varies between -1 and 1.
 * @example
 * tri(0.5)
 * -> 0
 */
export const tri = x => (2 / pi) * Math.asin(sin(x))

/**
 * Unipolar (output 0 to 1) Periodic triangle wave function using tau units, instead of radians. (0 to 1 is one cycle)
 * @function triUni
 * @param x {number} - Input number.
 * @returns {number} - Triangle wave value at x.  Output varies between 0 and 1.
 * @example
 * triUni(0.5)
 * -> 0.5
 */
export const triUni = x => (1 + (2 / pi) * Math.asin(sin(x))) * 0.5

/**
 * Periodic saw wave function (ascending ramp) using tau units, instead of radians. (0 to 1 is one cycle)
 * @function saw
 * @param x {number} - Input number.
 * @returns {number} - Saw wave value at x.  Output varies between -1 and 1.
 * @example
 * saw(0.5)
 * -> 0
 */
export const saw = x => 2 * (sawUni(x) - 0.5)

/**
 * Unipolar (output 0 to 1) Periodic saw wave function (ascending ramp) using tau units, instead of radians. (0 to 1 is one cycle)
 * @function sawUni
 * @param x {number} - Input number.
 * @returns {number} - Saw wave value at x.  Output varies between 0 and 1.
 * @example
 * sawUni(0.5)
 * -> 0.5
 */
export const sawUni = x => mod(x, 1)

/**
 * Periodic square wave function (low to high) using tau units, instead of radians. (0 to 1 is one cycle)
 * @function squ
 * @param x {number} - Input number.
 * @returns {number} - Square wave value at x.  Output varies between -1 and 1.
 * @example
 * squ(0.5)
 * -> 0
 */
export const squ = x => 2 * (squUni(x) - 0.5)

/**
 * Unipolar (output 0 to 1) Periodic square wave function (low to high) using tau units, instead of radians. (0 to 1 is one cycle)
 * @function squUni
 * @param x {number} - Input number.
 * @returns {number} - Square wave value at x.  Output varies between 0 and 1.
 * @example
 * squUni(0.5)
 * -> 0.5
 */
export const squUni = x => Math.round(sawUni(x))

/**
 * Periodic pulse width modulation wave function (low to high) using tau units, instead of radians. (0 to 1 is one cycle)
 * @function pwm
 * @param amt {number} - Width of high pulse, from 0 to 1. (fraction of wavelength)
 * @param x {number} - Input number.
 * @returns {number} - Pulse wave value at x.  Output varies between -1 and 1.
 * @example
 * pwm(0.5, 0.75)
 * -> 1
 */
export const pwm = _c((amt, x) => 2 * (pwmUni(amt, x) - 0.5))

/**
 * Unipolar (output 0 to 1) Periodic pulse width modulation wave function (low to high) using tau units, instead of radians. (0 to 1 is one cycle)
 * @function pwmUni
 * @param amt {number} - Width of high pulse, from 0 to 1. (fraction of wavelength)
 * @param x {number} - Input number.
 * @returns {number} - Pulse wave value at x.  Output varies between 0 and 1.
 * @example
 * pwmUni(0.5, 0.25)
 * -> 0
 */
export const pwmUni = _c((amt, x) => Math.floor(sawUni(x) + mod(amt, 1)))

const timesF = _c((f, count) => times(x => f(parseFloat(x) / count, x), count))
const autoList = fs => rmap(f => (f.arr = l => timesF(f, l)), fs)
autoList([cos, cosUni, sin, sinUni, tan, tri, triUni, saw, sawUni, squ, squUni])
/**
 * Gets the absolute value of a number. An alias for Math.abs
 * @function abs
 * @param a {number} - Signed number.
 * @returns {number} - Absolute number.
 * @example
 * abs(-1)
 * -> 1
 */
export const abs = Math.abs

/**
 * Perform exponentiation, i.e. 4^2. An alias for Math.pow
 * @function pow
 * @param b {number} - Base number. b^n
 * @param n {number} - Exponent. b^n
 * @returns {number} - Product
 * @example
 * pow(4, 2)
 * -> 8
 */
export const pow = Math.pow

/**
 * Perform exponentiation, i.e. 4^2. An alias for Math.pow with it's arguments flipped.
 * @function powFlipped
 * @param n {number} - Exponent. b^n
 * @param b {number} - Base number. b^n
 * @returns {number} - Product
 * @example
 * powFlipped(4, 2)
 * -> 16
 */
export const powFlipped = flip(Math.pow)

/**
 * A sigmoid function. In particular, a sigmoid that's shaped to be an audio saturation curve.
 * An S shaped function, maps all numbers to a value between -1 and 1
 * @function sigmoid
 * @param x {number} - Input number.
 * @returns {number} - Sigmoid function result.
 * @example
 * sigmoid(2)
 * -> 0.975609756097561
 */
export const sigmoid = x => 1 - 2 / (9 ** x + 1)

/**
 * A function with one parameter that can change vary the graph from y = 1 for all x,
 * to a sharp spike at x = 0 that drops to 0 everywhere else.
 * Similar to a gaussian curve.
 *
 * [View on desmos.com](https://www.desmos.com/calculator/ipcg2r0l0c)
 * @function mcn
 * @param shape {number} - The shape parameter. Variable between 0 and 1. 0 = flat at 1.  0.5 -> spike with wings of width 1. 1 -> infinitesimal spike at 0.
 * @param x {number} - Input number.
 * @returns {number} - McNaught function result.
 * @example
 * mcn(2)
 * -> 0.975609756097561
 */
export const mcn = _c((shape, x) => {
  const g = (shape + 1) ** 4 * Math.abs(x) + 1
  return 1 / g ** (shape * g)
})

/**
 * The transfer function for a butterworth LowPass filter.
 * The passband gives a value of 1 and the stopband gives a value of 0.
 * The slope gets wider as the cutoff increases.
 *
 * [View on desmos.com](https://www.desmos.com/calculator/7wurkbhv0v)
 * @function butterworthLPT
 * @param c {number} - the "cutoff value". Point where the function drops from 1 to 0.
 * @param slope {number} - the slope of the function. 1 gives a very gentle slope.  A value of 6 gives a slope that quickly drops within 1 of the cutoff.
 * @param x {number} - Input number.
 * @returns {number} - Output number.
 * @example
 * butterworthLPT(3, 4, 2)
 * -> 0.9984798754563001
 * butterworthLPT(3, 4, 3)
 * -> 0.5
 * butterworthLPT(3, 4, 4)
 * -> 0.00992314013539529
 */
export const butterworthLPT = _c((c, slope, x) => 1 / (1 + (x / c) ** (slope ** 2)))

/**
 * The transfer function for a butterworth highpass filter.
 * The passband gives a value of 1 and the stopband gives a value of 0.
 * The slope gets wider as the cutoff increases.
 *
 * [View on desmos.com](https://www.desmos.com/calculator/7wurkbhv0v)
 * @function butterworthHPT
 * @param c {number} - the "cutoff value". Point where the function rises from 0 to 1.
 * @param slope {number} - the slope of the function. 1 gives a very gentle slope.  A value of 6 gives a slope that quickly rises within 1 of the cutoff.
 * @param x {number} - Input number.
 * @returns {number} - Output number.
 * @example
 * butterworthHPT(3, 4, 2)
 * -> 0.0015201245436999493
 * butterworthHPT(3, 4, 3)
 * -> 0.5
 * butterworthHPT(3, 4, 4)
 * -> 0.9900768598646047
 */
export const butterworthHPT = _c((c, slope, x) => 1 / (1 + (x / c) ** -(slope ** 2)))

/**
 * A modelling of a lowpass filter where the slope parameter also produces a resonance peak around the cutoff.
 *
 * Like a cross section of a volcano centered around 0.
 * The `slope` gets wider as the cutoff increases.
 *
 * [View on desmos.com](https://www.desmos.com/calculator/tkogwsawdb)
 * @function volcano
 * @param c {number} - The "cutoff value". Point where the function rises from 0 to 1.
 * @param slope {number} - The slope of the function. 0 gives y = 1, 0.5 gives a gentle slope, 1 gives a resonance with an amplitude of 2. 10 gives a huge resonant peak.
 * @param x {number} - Input number.
 * @returns {number} - Output number.
 * @example
 * lowpassT(100, 1, 50)
 * -> 1.28
 * lowpassT(100, 4.7, 100)
 * -> 5.7
 */
export const volcano = _c((c, slope, x) => (slope + 1) / (slope ** 2 * (1 - (x / c) ** 2) ** 2 + 1))

/**
 * Models a transfer function for a bandpass filter using the sech trigonometric function. Attempts to match the slope of the butterworth transfer functions.
 *
 * @function bandpassT
 * @param c {number} - The "cutoff value". Point where the function peaks.
 * @param slope {number} - The slope of the function. 1 gives a very gentle slope.  A value of 6 gives a slope that quickly rises within 1 of the cutoff.
 * @param x {number} - Input number.
 * @returns {number} - Output number.
 * @example
 * bandpassT(100, 1, 50)
 * -> 0.886818883970074
 * bandpassT(100, 4.7, 100)
 * -> 1
 */
export const bandpassT = _c((c, slope, x) => sech((slope ** 2 * (x - c)) / c))

/**
 * The transfer function for a butterworth LowPass filter, with an added resonance peak provided by a bandpass filter at the cutoff position.
 * The passband gives a value of 1 and the stopband gives a value of 0.
 * The slope gets wider as the cutoff increases.
 *
 * [View on desmos.com](https://www.desmos.com/calculator/nn9pzozc0i)
 * @function advLowpassT
 * @param c {number} - The "cutoff value". Point where the function drops from 1 to 0 (without resonance).
 * @param slope {number} - The slope of the function. 1 gives a very gentle slope.  A value of 6 gives a slope that quickly drops within 1 of the cutoff.
 * @param q {number} - The resonance or Q factor (providing a peak at cutoff) the parameter linearly adjusts the amplitude of the peak. 0 = no resonance. 1 = a peak of amplitude approx 1.5.
 * @param x {number} - Input number.
 * @returns {number} - Output number.
 * @example
 * advLowpassT(3, 4, 1, 2)
 * -> 1.0081355503788596
 * advLowpassT(3, 4, 1, 3)
 * -> 1.5
 * advLowpassT(3, 4, 3, 4)
 * -> 0.03889016490307382
 */
export const advLowpassT = _c((c, slope, q, x) => butterworthLPT(c, slope, x) + q * bandpassT(c, slope, x))

/**
 * Convert frequency to octave number. Using abstract units where 1f = first octave.  An alias of Math.log2
 * @function ftoOct
 * @param x {number} - Input frequency.
 * @returns {number} - Output octave number (assuming a frequency of 1 is your first octave).
 * @example
 * ftoOct(22.4)
 * -> 4.485426827170242
 */
export const ftoOct = Math.log2

/**
 * Convert frequency to wavelength.  Using abstract units where 1f = 1length. Identical to 1/x or the inverse function.
 * @function ftoWLen
 * @param x {number} - Input frequency.
 * @returns {number} - Output wavelength (assuming a frequency of 1 gives a wavelength of 1)
 * @example
 * ftoWLen(22.4)
 * -> 0.04464285714285714
 */
export const ftoWLen = x => 1 / x

/**
 * Models a bouncing ball using a series of parabolas. the domain is from 0 to 1.
 *
 * [View on desmos.com](https://www.desmos.com/calculator/ghwrzadmk9)
 * @function bouncingBall
 * @param bounces {number} - number of bounces.
 * @param length {number} - length of the sequence.
 * @param dropOffFactor {number} - how fast the bounces loose height
 * @param x {number} - the height of the ball at position x.
 * @returns {type} - rdesc
 * @example
 *
 * ->
 */
export const bouncingBall = _c((bounces, length, dropOffFactor, x) => {
  const z = (2 ** (1 - bounces) * (2 ** bounces - 1)) / length
  const recurse = (f, x) => {
    const y = f(x)
    return y >= 0 ? y : recurse((g, u) => dropOffFactor * g(2 * (u - 1 / z)))(f), x
  }
  return recurse(x => -4 * z * x * (z * x - 1), x)
})
/**
 * The [Chebyshev polynomial](https://en.wikipedia.org/wiki/Chebyshev_polynomials) function.
 *
 * Output domain is between -1 and 1 for x values between -1 and 1
 *
 * [View on desmos.com](https://www.desmos.com/calculator/ftitozpcrt)
 * @function chebyPoly
 * @param n {number} - The polynomial number. T_n
 * @param x {number} - Input value.
 * @returns {number} - Output value.
 * @example
 * chebyPoly(2, 0.5)
 * -> -0.5
 */
export const chebyPoly = _c((n, x) => {
  if (x < -1) return (-1) ** n * Math.cosh(n * Math.acosh(-x))
  if (x > 1) return Math.cosh(n * Math.acosh(x))
  return Math.cos(n * Math.acos(x))
})

/**
 * Rounds a number to a specified number of decimal places.
 * @function maxDecimal
 * @param n {number} - Number of decimal places.
 * @param x {number} - The value to round.
 * @returns {type} - The rounded number.
 * @example
 * maxDecimal(3, math.pi)
 * -> 3.142
 */
export const maxDecimal = _c((n, x) => {
  const factor = 10 ** n
  return Math.round((x + Number.EPSILON) * factor) / factor
})

export const primes = num => {
  let arr = Array.from({ length: num - 1 }).map((x, i) => i + 2),
    sqroot = Math.floor(Math.sqrt(num)),
    numsTillSqroot = Array.from({ length: sqroot - 1 }).map((x, i) => i + 2)
  numsTillSqroot.forEach(x => (arr = arr.filter(y => y % x !== 0 || y === x)))
  return arr
}

export const myprimes = num => {
  let arr = range(2, num + 1)
  rmap(x => (arr = arr.filter(y => y % x !== 0 || y === x)), range(2, flr(sqrt(num))))
  return arr
}

/**
 * Calculate a list of fibonacci numbers of length n from 1.
 * @function fibonacci
 * @param n {number} - Length of output array.
 * @returns {array} n fibonacci numbers from 1 in an array.
 * @example
 * fibonacci(6)
 * -> [0, 1, 1, 2, 3, 5]
 */
export const fibonacci = n =>
  Array.from({ length: n }).reduce((acc, val, i) => acc.concat(i > 1 ? acc[i - 1] + acc[i - 2] : i), [])

/**
 * Checks if the provided number is prime.
 * @function isPrime
 * @param n {number} - Number to check.
 * @returns {boolean} Returns true if the number is prime, false otherwise.
 * @example
 * isPrime(11)
 * -> true
 */
export const isPrime = n => {
  const boundary = Math.floor(Math.sqrt(n))
  for (let i = 2; i <= boundary; i++) if (n % i === 0) return false
  return n >= 2
}

/**
 * Geometric progression array.
 * @function geometricProgression
 * @param end {number} - End number of the sequence.
 * @param start {number} - Starting number of the sequence.
 * @param step {number} - Amount to step.
 * @returns {type} - rdesc
 * @example
 * geometricProgression(256)
 * -> [1,2,4,8,16,32,64,128,256]
 */
export const geometricProgression = (end, start = 1, step = 2) =>
  Array.from({
    length: Math.floor(Math.log(end / start) / Math.log(step)) + 1
  }).map((_, i) => start * step ** i)
geometricProgression.noCurry = true

/**
 * Arithmetic  progression array.
 * @function arithmeticProgression
 * @param n {number} - Number to increment by.
 * @param lim {number} - Ending number of the sequence.
 * @returns {type} - rdesc
 * @example
 * arithmeticProgression(5, 25)
 * -> [5,10,15,20,25]
 */
export const arithmeticProgression = _c((n, lim) => Array.from({ length: Math.ceil(lim / n) }, (_, i) => (i + 1) * n))

export const agm = _c((a, b) => {
  const f = (c, d) => [0.5 * (c + d), sqrt(c * d)]
  const err = (c, d) => c.toString().slice(0, 8) == d.toString().slice(0, 8)
  let g = [a, b]
  while (!err(...g)) {
    g = f(...g)
  }
  return mid(...g)
})
export const cplx = complex
export const c = complex
export const map = _map
// module.exports.c = module.exports.cplx
// module.exports = autoCurry(module.exports)
// module.exports.map = module.exports._map
