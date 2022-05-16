/**
 * A collection of general use functional programming operations. (to suppliment ramda.js)
 * @module functional
 */
import { isFunction } from 'ramda-adjunct'
import {
  always,
  compose,
  repeat,
  chain,
  map,
  curry as _c,
  zipWith,
  head,
  last,
  init,
  times,
  flip,
  apply,
  mathMod,
  nAry,
  addIndex,
  curryN
} from 'ramda'

/**
 * Checks to see if an item is an array.  An alias of Array.isArray()
 * @function isArray
 * @param variableOrOperand {any} - item to check
 * @returns {boolean} - Returns `true` if the item is an array.
 * @example
 * isArray([])
 * -> true
 * isArray([1,2,3])
 * -> true
 * isArray(345)
 * -> false
 */
export const isArray = Array.isArray

/**
 * Checks to see if an item is a string.
 * @function isString
 * @param variableOrOperand {any} - item to check
 * @returns {boolean} - Returns `true` if the item is a string.
 * @example
 * isString([])
 * -> false
 * isString("tubalcain")
 * -> true
 * isString(345)
 * -> false
 */
export const isString = x => typeof x === 'string'

/**
 * A function that can make anything "function like", by returning a function that is either the function supplied, or a function that returns the item supplied.
 * Useful for creating flexible functions who's arguments can accept either constant values or functions.
 *
 * For example, it was used to create oscillators who's amplitude could be either a constant or a function over time.
 * @function funcOrConst
 * @param x {any} - the item to make "function like"
 * @returns {type} - rdesc
 * @example
 * const variable = funcOrConst(1)
 *
 * ->
 */
export const funcOrConst = x => (isFunction(x) ? x : always(x))

/**
 * Function iterator operation.  It applies a function to itself n times. i.e. if n is 3, it will return a function that looks like x => f(f(f(x))) Must be a unary function of type a -> a.
 *
 * Useful for fractal-like recursion among other things.
 * @function iterateF
 * @param f {function} - A function
 * @param n {number} - Number of times to iterate.  Should be a nonzero positive integer.
 * @returns {function} - The new function that is f iterated n times.
 * @example
 * const collatz = x => math.isEven(x) ? x / 2 : 3 * x + 1
 * const tenSteps = iterateF(collatz, 10)
 * tensteps(12)
 * -> 1
 */
export const iterateF = _c((f, n) => compose(...repeat(f, Math.abs(Math.floor(n)))))

/**
 * A map operator that 'flattens' the result. i.e. when a map returns a nested array, it will be transformed into a single array (only removes one layer of nesting).  Is simply an alias of ramda's chain.
 *
 * @function flatMap
 * @param f {function} - Function to map.
 * @param list {array} - List or iterable to map over. If this is instead, a function, acts as `f(list(x), x)`
 * @returns {type} - Mapped and flattened result.
 * @example
 * const duplicate = n => [n, n]
 * flatmap(duplicate, [1, 2, 3])
 * -> [1, 1, 2, 2, 3, 3]
 */
export const flatMap = chain

/**
 * If given an array, returns the array, if given anything else, returns a singleton array with that thing.
 *
 * Useful for wrapping a value in an array before applying a list operation, so that a function can accept a list or a single value as an argument.
 * @function wrapSingle
 * @param myArrOrVal {any} - Array or value to wrap.
 * @returns {array} - Array or wrapped value.
 * @example
 * wrapSingle([1])
 * -> [1]
 * wrapSingle(1)
 * -> [1]
 */
export const wrapSingle = myArrOrVal => (Array.isArray(myArrOrVal) ? myArrOrVal : [myArrOrVal])

/**
 * Combines all arguments into a flattened array. Similar to `wrapSingle` but accepts any number of items and concatenates the results.
 * @function wrapMany
 * @param allArguments {any} - Arrays or values to wrap.
 * @returns {array} - An array of all arguments, flattened.
 * @example
 * wrapMany([1], [2, 3], 4)
 * -> [1,2,3,4]
 * wrapSingle(1)
 * -> [1]
 */
export const wrapMany = (...args) => flatMap(wrapSingle, args)
wrapMany.noCurry

/**
 * A convienience function that includes the ability to provide an argument to the function before applying ramda's map.
 *
 * It is literally `(f, arg, xs) => map(f(arg), xs)`
 * @function mapC
 * @param f {function} - function to apply.
 * @param arg {any} - argument for f.
 * @returns {function} - function awaiting list processing.
 * @example
 * const addToAll = mapC(add)
 * addToAll(1, [1,2,3])
 * -> [2,3,4]
 */
export const mapC = _c((f, arg, xs) => map(f(arg), xs))

/**
 * Builds a list using the specified function and arguments. Useful for non-deterministic functions (functions that return different outputs for identical inputs)
 * @function repeatFrom
 * @param f {function} - function to apply.
 * @param n {number} - number of times to iterate
 * @param args {any} - arguments for `f`.
 * @returns {type} - list with length `n` containing function outputs.
 * @example
 * const randomList = repeatFrom(randomRangeI, 10, 0, 100)
 * -> [45, 1, 32, 8, 64, 78, 21, 50, 13, 51]
 */
export const repeatFrom = (f, n, ...args) => times(() => f(...args), n)
repeatFrom.noCurry

/**
 * Applies an array of functions to an item, the result being an array of the results.
 * @function seq
 * @param fs {array} - an array of functions.
 * @param x {any} - the item to operate on.
 * @returns {array} - array of function outputs.
 * @example
 * seq([math.add(1), math.sub(1)], 2)
 * -> [3, 1]
 */
export const seq = _c((fs, x) => map(f => f(x), fs))

/**
 * Applies the curry function to all functions in an object (shallow map).
 *
 * Note:  If a function has the property `noCurry` set to `true`, the function will not be curried.
 * @function autoCurry
 * @param object {object} - The object to map curry to.
 * @returns {type} - the object with curried functions.
 * @example
 * module.exports = autoCurry(module.exports)
 * -> All exports are now curried.
 */
export const autoCurry = map(item => {
  if (isFunction(item) && item.length > 1 && !item.noCurry) {
    return curry(item)
  }
  return item
})

/**
 * Maps through an object and looks for any functions that have arity 2.  It then creates a `.zip` function as a prop on that function that supplies zipWith functionality for that function.
 *
 * Note:  If a function has the property `noZip` set to `true`, the function will not be created.
 * @function autoZipWith
 * @param object {object} - The object to map zip to.
 * @returns {type} - the object with updated functions.
 * @example
 * math.add = (a, b) => a + b
 * math.sub = (a, b) => a - b
 * math = autoZipWith(math)
 * -> All functions in math with arity 2 are now have their own zip.
 * math.add.zip([1,1,1],[2,2,2])
 * -> [3,3,3]
 */
export const autoZipWith = map(item => {
  if (isFunction(item) && item.length == 2 && !item.noZip) {
    item.zip = zipWith(item)
    return item
  }
  return item
})

/**
 * String function that inserts a string within another string at a supplied position.
 * @function insertAt
 * @param sub {string} - String to insert.
 * @param pos {number} - Position (character wise) to insert the string.
 * @param sub {string} - String to operate on.
 * @returns {type} - new string with the inserted text.
 * @example
 *
 * ->
 */
export const insertAt = (sub, pos, str) => `${str.slice(0, pos)}${sub}${str.slice(pos)}`

/**
 * This is a custom partial application function generator that gives you many options in how to call it.  It was created to wrap `x => pipe(transformAtoB,...operationsOnB,transformBbackToA)` functions.
 * The new function can be called using flexible syntax options, provided the data is an array.
 * @function makeSuperPipe
 * @param function {function} - pipe or compose function with the form `x => pipe(transformAtoB,...operationsOnB,transformBbackToA)`
 * @returns {function} - 'superPipe' function.
 * @example
 * const fftAndBack = makeSuperPipe(x => pipe(fft, ...x, ifft))
 * -> fftAndBack function now takes a time domain waveform array, and applies frequency domain functions to it, returning the time domain result.
 * fftAndBack(removeFundamental, muteEvenHarmonics, waveform)
 * fftAndBack(removeFundamental, muteEvenHarmonics)(waveform)
 * fftAndBack([removeFundamental, muteEvenHarmonics], waveform)
 * fftAndBack([removeFundamental, muteEvenHarmonics])(waveform)
 * -> all these calls are functionally equivalent.
 */
export const makeSuperPipe = f => (...a) => {
  if (a.length > 1) {
    if (isArray(head(a))) {
      if (isArray(last(a))) {
        return f(head(a))(last(a))
      }
      return f(a)
    }
    return isArray(last(a)) ? f(init(a))(last(a)) : f(a)
  }
  return isArray(head(a)) ? f(head(a)) : f(a)
}
makeSuperPipe.noCurry = true

/**
 * Supplied with 2 functions that transform type a -> b, and b -> a, makes a function that takes a pair of type a, transforms them to b, combines them with a supplied function, finally - transforms the result back to type a.
 * @function transformAndCombinePair
 * @param f {function} - Convert data from type a into type b
 * @param g {function} - Convert data from type b into type a
 * @returns {function} - Combiner function.
 * @example
 * // here, type a is an array of real numbers, and type b in an FFT array of complex numbers.
 * const freqDomainCombine = transformAndCombinePair(fft, ifft)
 * // next, we supply a function to multiply each complex number in the two arrays (zipping) and return the resulting array.
 * const convolution = freqDomainCombine(multiplyZip)
 * // finally, we can apply the function to two real number arrays (in this case, two waveforms)
 * convolution(waveA, waveB)
 * -> *convolution of waves A and B*
 */
export const transformAndCombinePair = _c((f, g) => _c((h, a, b) => g(h(f(a), f(b)))))

export const converge2 = (target, fs) => (...args) => target(...map(flip(apply)(args), fs))

export const rotate = (n, arr) => {
  const m = mathMod(-n, arr.length)
  if (typeof arr === 'string') return arr.slice(m) + arr.slice(0, m)
  return [arr.slice(m), arr.slice(0, m)].flat()
}

export const rotateArgs = _c((n, f, arity) => {
  if (f.length === 1) return f
  if (arity === undefined && f.length) {
    return curry(nAry(f.length, (...args) => f(...rotate(n, args))))
  } else if (arity > 1) {
    return curry(nAry(arity, (...args) => f(...rotate(n, args))))
  }
  return (...args) => f(...rotate(n, args))
})

// export const tz = (n, f) => {
//   const argMap = Array.from(n.toString()).map(x => parseInt(x) - 1)
//   //if(f.length > 0 && f.length < argMap.length) argMap.slice(f.length)
//   return curryN(argMap.length, (...args) => {
//     const newArgs = addIndex(map)((a, i) => {
//       const newPos = argMap.indexOf(i)
//       return newPos !== -1 ? args[newPos] : a
//     }, args)
//     console.log({ argMap, args, newArgs, alen: args.length })
//     return f.length === 0 ? f(...newArgs) : f(...newArgs)
//   })
// }
export const swap = _c((n, f) => {
  const argMap = Array.from(n.toString()).map(x => parseInt(x) - 1)
  return curryN(argMap.length, (...args) =>
    f(
      ...addIndex(map)((a, i) => {
        const newPos = argMap.indexOf(i)
        return newPos !== -1 ? args[newPos] : a
      }, args)
    )
  )
})

export const lift2 = _c((f, g, h, x) => f(g(x))(h(x)))
