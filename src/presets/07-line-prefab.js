import { randomRangeI, randomRange } from '../utils/random.js'
import { makeTrack, saveTrack } from '../track/track.js'
import { makeBlueprint, makeSpawnPoint, toObjVect } from '../track/blueprint.js'
import { times, filter, pipe, call, thunkify, map, repeat, flatten, mergeDeepWith, zipWith, curry } from 'ramda'
import { times3D } from '../utils/array.js'
import { makeCylinder0Line } from '../track/prefabs.js'
import * as v from '../utils/vector.js'
import * as m from '../utils/math.js'

// results: rotation is left handed.

export const go = async () => {
  let track = await makeTrack('lineprefab')
  track.items = makeCylinder0Line([0, 0, 0], [10, 10, 0])
  // console.log(items)

  track.items.push(makeSpawnPoint([0, 1, -20]))
  track.Track.hideDefaultSpawnpoint = true
  // console.log(JSON.stringify(track, null, 4))
  await saveTrack(track)
  return 'preset finished running.'
}

export default go
