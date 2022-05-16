import { randomRangeI, randomRange } from '../utils/random.js'
import { makeTrack, saveTrack } from '../track/track.js'
import { makeBlueprint, makeSpawnPoint, toObjVect } from '../track/blueprint.js'
import { times, filter, pipe, call, thunkify, map, repeat, flatten, mergeDeepWith, zipWith, curry } from 'ramda'
import { times3D } from '../utils/array.js'
import * as v from '../utils/vector.js'
import * as m from '../utils/math.js'

export const go = async () => {
  let track = await makeTrack('mesh')
  track.items.push(makeSpawnPoint([0, 1, -20]))
  track.Track.hideDefaultSpawnpoint = true
  // console.log(JSON.stringify(track, null, 4))
  await saveTrack(track)
}

export default go
