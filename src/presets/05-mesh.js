import { randomRangeI, randomRange } from '../utils/random.js'
import { makeTrack, saveTrack } from '../track/track.js'
import { makeBlueprint, makeSpawnPoint, toObjVect } from '../track/blueprint.js'
import { times, filter, pipe, call, thunkify, map, repeat, flatten, mergeDeepWith, zipWith, curry } from 'ramda'
import { times3D } from '../utils/array.js'
import * as v from '../utils/vector.js'
import * as m from '../utils/math.js'

const dethunk = map(call)
const randomRangeArr = (min, max, len) => dethunk(repeat(thunkify(randomRange)(min, max), len))

export const go = async () => {
  let track = await makeTrack('mesh')

  const density = 1
  const len = 10
  const origin = [0, 3, 0]

  const translate = curry((vect, blueprint) => mergeDeepWith(zipWith(m.add), blueprint, { position: vect }))

  const makeNode = () => {
    return [
      makeBlueprint('cylinder0x5', [0, 0, 0], [0, 0, 0]),
      makeBlueprint('cylinder0x5', [0, 0, 0], [m.halfpi, 0, 0]),
      makeBlueprint('cylinder0x5', [0, 0, 0], [0, 0, m.halfpi])
    ]
  }

  track.items = flatten(
    times3D(
      pos => {
        // console.log('wtf')
        const worldPos = pipe(v.scl(5), v.add(origin))(pos)
        // const a = randomRangeArr(-angle, angle, 3)
        // const rot = [0, 0, 0]
        // console.log({ p, a })
        return map(translate(worldPos), makeNode())
      },
      len,
      len,
      len
    )
  )
  track.items.push(makeSpawnPoint([0, 0, -100]))
  track.Track.hideDefaultSpawnpoint = true

  // console.log(JSON.stringify(track, null, 4))
  await saveTrack(track)
}

export default go
