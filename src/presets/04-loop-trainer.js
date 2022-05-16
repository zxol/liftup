import { randomRangeI, randomRange } from '../utils/random.js'
import { makeTrack, saveTrack } from '../track/track.js'
import { makeBlueprint, makeSpawnPoint } from '../track/blueprint.js'
import { times, filter, pipe, append, concat, flatten } from 'ramda'
import { timesF } from '../utils/array.js'
import * as v from '../utils/vector.js'
import * as m from '../utils/math.js'

// construct a loop made from hoops, origin is bottom, arc is
const makeLoop = (origin, radius, numRings, arc = 0.85) => {
  const items = timesF((x, i) => {
    const translation = v.add(v.add([0, radius, 0], origin))
    const y = m.map(0, 1, -0.25, -0.25 + arc, x)
    const pos = pipe(v.rot3z(m.tau * y), translation)([radius, 0, 0])
    // console.log(pos)
    const angle = [m.halfpi - m.tau * y, m.halfpi, 0]
    const out = makeBlueprint('lightHoop1', pos, angle)
    return out
  }, numRings)
  return items
}

export const go = async () => {
  let track = await makeTrack('looptrainer')

  const gap = 5
  const radStep = 0.3
  const radStart = 3
  const arcLen = 0.85
  const density = 1.5
  const numLoops = 20
  track.items = concat(
    track.items,
    flatten(
      times(i => {
        const radius = radStart + i * radStep
        const numRings = m.flr(m.pi * radius * density * arcLen)
        return makeLoop([0, 5, gap * i], radius, numRings, arcLen)
      }, numLoops)
    )
  )

  track.items.push(makeSpawnPoint([0, 0.1, -30]))
  track.Track.hideDefaultSpawnpoint = true
  // console.log(JSON.stringify(track, null, 4))
  await saveTrack(track)
}

export default go
