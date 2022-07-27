import { makeBlueprint } from './blueprint.js'
import * as v from '../utils/vector.js'
import { sum, repeat, sortBy, lt, groupWith, equals, map, curry as _c } from 'ramda'
import { flatMap } from '../utils/functional.js'
import { mapI } from '../utils/array.js'
import * as m from '../utils/math.js'

export const makeArrayFromUnits = (target, units) => {
  units = sortBy(lt, units)
  let remaining = target
  const firstSection = map(unit => {
    const count = m.flr(remaining / unit)
    const out = repeat(unit, count)
    remaining -= unit * count
    return out
  }, units)
  const out = mapI(items => ({ sum: sum(items), items, fractional: items[0] < 1 && items[0] > 0 }), [
    ...firstSection,
    remaining !== 0 ? [remaining] : []
  ])
  console.log(out)
  return out
}

export const makeItemLine = (p1, p2, itemLength, itemID, throughAxis) => {
  // const lineLen = v.dist(p1, p2)

  // console.log(lineLen)
  return lineLen
}

// console.log(makeItemLine([0, 0, 0], [1, 1, 1]))

export const makeCylinder0Line = _c((color, p1, p2) => {
  const vect = v.mapTidy(v.sub(p2, p1))
  const unit = v.mapTidy(v.unit(vect)) // const unitM = v.sub([0, 1, 0], unit)
  const ang = v.angles(unit)
  const len = v.tidyFloat(v.mag(vect))
  // console.log({ vect, unit, ang: map(x => (360 * x) / m.tau, ang), len })
  // console.log(len)
  // console.log(v.mag(unit))
  let curPos = [...p1]
  return flatMap(group => {
    if (group.fractional)
      return makeBlueprint(`DrawingBoardCylinder0.5mx${1}m0${color}`, v.sub(curPos, v.scl(group.items[0], unit)), ang)
    return mapI((item, i) => {
      const out = makeBlueprint(`DrawingBoardCylinder0.5mx${item}m0${color}`, curPos, ang)
      const step = v.scl(item, unit)
      curPos = v.add(curPos, step)
      return out
    }, group.items)
  }, makeArrayFromUnits(len, [5, 1]))

  // return makeItemLine(p1, p2, 5, 'DrawingBoardCylinder0.5mx5m04', 'y')
})
