import { tau } from '../utils/math.js'
import { zipObj, compose, map, mergeAll, multiply, mergeDeepRight, evolve, pipe, mergeDeepWith, curry } from 'ramda'
import * as m from '../utils/math.js'

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

export const validateTransformBlueprint = pipe(
  mergeDeepRight({ purpose: 'Functional', '@_xsi:type': 'TrackBlueprintFlag' }),
  evolve({ position: fixedVect, rotation: radiansToDegrees })
)

export const makeBlueprint = (itemID, position = [0, 0, 0], rotation = [0, 0, 0]) => {
  return {
    itemID: ids[itemID] ?? itemID,
    position,
    rotation
  }
}

let spawnNumberState = 2
export const makeSpawnPoint = (position = [0, 0, -30], rotation = [0, 0, 0], _number) => {
  const number = _number ?? spawnNumberState++
  return {
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
