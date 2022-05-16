import { randomRangeI, randomRange } from '../utils/random.js'
import { makeTrack, saveTrack } from '../track/track.js'
import { makeBlueprint, makeSpawnPoint, toObjVect } from '../track/blueprint.js'
import { times, filter, pipe, call, thunkify, map, repeat, flatten, mergeDeepWith, zipWith, curry } from 'ramda'
import { times3D } from '../utils/array.js'
import * as v from '../utils/vector.js'
import * as m from '../utils/math.js'

export const go = async () => {
  let track = await makeTrack('rotationsurvey')
  track.items.push(makeBlueprint('DrawingBoardCylinder0.5mx5m01', v.z3(), v.z3()))
  track.items.push(makeBlueprint('DrawingBoardCylinder0.5mx5m02', v.z3(), [m.halfpi, 0, 0]))
  track.items.push(makeBlueprint('DrawingBoardCylinder0.5mx5m03', v.z3(), [m.pi, 0, 0]))
  track.items.push(makeBlueprint('DrawingBoardCylinder0.5mx5m04', v.z3(), [(3 * m.pi) / 4, 0, 0]))
  track.items.push(makeSpawnPoint([0, 1, -20]))
  track.Track.hideDefaultSpawnpoint = true
  // console.log(JSON.stringify(track, null, 4))
  await saveTrack(track)
  return 'preset finished running.'
}

export default go
