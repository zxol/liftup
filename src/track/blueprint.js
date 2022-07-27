import { tau } from '../utils/math.js'
import {
  zipObj,
  compose,
  map,
  mergeAll,
  multiply,
  mergeDeepRight,
  evolve,
  pipe,
  mergeDeepWith,
  curry,
  collectBy,
  equals,
  dropLast,
  uniqWith,
  omit
} from 'ramda'
import * as m from '../utils/math.js'
import { v4 as genUUID } from 'uuid'

export const ids = {
  cube1: 'DrawingBoardCube1mx1m04',
  cube10: 'DrawingBoardCube10mx10m04',
  cube5: 'DrawingBoardCube5mx5m04',
  cylinder0x1: 'DrawingBoardCylinder0.5mx1m04',
  cylinder0x5: 'DrawingBoardCylinder0.5mx5m04',
  cylinder1x1: 'DrawingBoardCylinder1mx1m04',
  cylinder1x5: 'DrawingBoardCylinder1mx5m04',
  plate: 'DrawingBoardPlate4mx4m04',
  wall: 'DrawingBoardWall5mx5m04',
  beam: 'ASLLightBeam02',
  lightHoop1: 'ASLLightHoopGate01',
  octgate: 'OctagonGate200x200cmGeneric01'
}
const decimals = 5
const tauR = 360 / tau

export const toObjVect = zipObj(['x', 'y', 'z'])
// const radiansToDegrees = arr => ({ x: arr[0] * tauR, y: arr[1] * tauR, z: arr[2] * tauR })
const radiansToDegrees = compose(toObjVect, map(compose(n => n.toFixed(decimals), multiply(tauR))))
const fixedVect = compose(
  toObjVect,
  map(n => n.toFixed(decimals))
)

export const translateBlueprint = curry((vect, blueprint) =>
  mergeDeepWith(zipWith(m.add), blueprint, { position: vect })
)

export const rotateBlueprint = curry((vect, blueprint) => mergeDeepWith(zipWith(m.add), blueprint, { rotation: vect }))

export const removeSuperimposedBlueprints = items => {
  // const grouped = collectBy(compose(dropLast(2), prop('itemID')), items)
  // console.log(items)
  const out = uniqWith((a, b) => {
    return (
      equals(dropLast(2, a.itemID), dropLast(2, b.itemID)) &&
      equals(a.position, b.position) &&
      equals(a.rotation, b.rotation)
    )
  }, items)
  console.log(out)
  return out
}

export const validateTransformBlueprint = pipe(
  omit(['uuid']),
  mergeDeepRight({ purpose: 'Functional', '@_xsi:type': 'TrackBlueprintFlag' }),
  evolve({ position: fixedVect, rotation: radiansToDegrees })
)

export const makeBlueprint = (itemID, position = [0, 0, 0], rotation = [0, 0, 0]) => {
  return {
    uuid: genUUID(),
    itemID: ids[itemID] ?? itemID,
    position,
    rotation
  }
}

export const makeSpawnPoint = (position = [0, 0, -30], rotation = [0, 0, 0], number = 2) => {
  return {
    uuid: genUUID(),
    itemID: `SpawnPointSingle0${number}`,
    position,
    rotation,
    spawnpoint: {
      name: `Spawn ${number}`,
      '@_xsi:type': 'NamedDroneSpawnpoint'
    },
    '@_xsi:type': 'TrackBlueprintSpawnpoint'
  }
}
