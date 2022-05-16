import { randomRangeI, randomRange } from '../utils/random.js'
import { makeTrack, saveTrack } from '../track/track.js'
import { makeBlueprint, makeSpawnPoint } from '../track/blueprint.js'
import { times, filter, pipe, call, thunkify, map, repeat, flatten } from 'ramda'
import { times3D } from '../utils/array.js'
import * as v from '../utils/vector.js'
import * as m from '../utils/math.js'

const dethunk = map(call)
const randomRangeArr = (min, max, len) => dethunk(repeat(thunkify(randomRange)(min, max), len))

export const go = async () => {
  let track = await makeTrack('grid')

  const density = 1
  const len = 20
  const angle = Math.PI

  track.items = flatten(
    times3D(
      pos => {
        // console.log('wtf')
        const p = pipe(v.add([0, 3, 0]), v.scl(7))(pos)
        // const a = randomRangeArr(-angle, angle, 3)
        const a = [0, 0, 0]
        // console.log({ p, a })
        return makeBlueprint('cube1', p, a)
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
