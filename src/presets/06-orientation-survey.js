import { randomRangeI, randomRange } from '../utils/random.js'
import { makeTrack, saveTrack } from '../track/track.js'
import { makeBlueprint, makeSpawnPoint, toObjVect } from '../track/blueprint.js'
import { times, filter, pipe, call, thunkify, map, repeat, flatten, mergeDeepWith, zipWith, curry } from 'ramda'
import { times3D } from '../utils/array.js'
import * as v from '../utils/vector.js'
import * as m from '../utils/math.js'

// results: rotation is left handed.

export const go = async () => {
  let track = await makeTrack('rotationsurvey')
  track.items.push(makeBlueprint('DrawingBoardCylinder0.5mx5m01', [0, 5, 0], [0, 0, 0]))
  track.items.push(makeBlueprint('DrawingBoardCylinder0.5mx5m02', [0, 5, 0], [0, 0, m.halfpi]))
  track.items.push(makeBlueprint('DrawingBoardCylinder0.5mx5m03', [0, 5, 0], [0, 0, m.pi]))
  track.items.push(makeBlueprint('DrawingBoardCylinder0.5mx5m04', [0, 5, 0], [0, 0, (3 * m.tau) / 4]))

  track.items.push(
    makeBlueprint('DrawingBoardCylinder0.5mx5m01', pipe(v.rot3z(0), v.add([0, 5, 0]))([0, 5, 0]), [0, 0, 0])
  )
  track.items.push(
    makeBlueprint('DrawingBoardCylinder0.5mx5m02', pipe(v.rot3z(m.halfpi), v.add([0, 5, 0]))([0, 5, 0]), [
      0,
      0,
      m.halfpi
    ])
  )
  track.items.push(
    makeBlueprint('DrawingBoardCylinder0.5mx5m03', pipe(v.rot3z(m.pi), v.add([0, 5, 0]))([0, 5, 0]), [0, 0, m.pi])
  )
  track.items.push(
    makeBlueprint('DrawingBoardCylinder0.5mx5m04', pipe(v.rot3z((3 * m.tau) / 4), v.add([0, 5, 0]))([0, 5, 0]), [
      0,
      0,
      (3 * m.tau) / 4
    ])
  )

  track.items.push(makeSpawnPoint([0, 1, -20]))
  track.Track.hideDefaultSpawnpoint = true
  // console.log(JSON.stringify(track, null, 4))
  await saveTrack(track)
  return 'preset finished running.'
}

export default go
