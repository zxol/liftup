import { randomRangeI, randomRange } from '../utils/random.js'
import { makeTrack, saveTrack } from '../track/track.js'
import { makeBlueprint, makeSpawnPoint, toObjVect } from '../track/blueprint.js'
import { flatten, unnest } from 'ramda'
import { timesF, times3D, timesF2D, mapI } from '../utils/array.js'
import { makeCylinder0Line } from '../track/prefabs.js'
import * as v from '../utils/vector.js'
import * as m from '../utils/math.js'

// results: rotation is left handed.

export const go = async (numLines = 4) => {
  let track = await makeTrack('rotations')

  const f2angle360 = x => x * m.tau - m.pi
  const f2angleneg90pos90 = x => x * m.pi - m.hpi

  const sp = [0, 40, 20]
  const radius = 40
  // const eps = timesF(x => v.add(sp, [radius * m.sin(x), 10, radius * m.cos(x)]), numLines)
  const eps = unnest(
    // timesF2D(([x, y]) => v.add(sp, v.spherical2Rect([radius, x * m.tau - m.pi, y * m.tau - m.pi])), numLines, numLines)
    timesF2D(
      ([x, y]) => v.add(sp, v.spherical2Rect([radius, f2angle360(x), f2angleneg90pos90(y)])),
      numLines * 2,
      numLines / 2
    )
  )

  console.log(eps)
  track.items = flatten(mapI((ep, i) => makeCylinder0Line(m.mod(i, 4) + 1, sp, ep), eps))
  // track.items = [makeBlueprint('cool00'), makeBlueprint('cool11')]
  // console.log(items)

  track.items.push(makeSpawnPoint([0, 1, -20]))
  track.Track.hideDefaultSpawnpoint = true
  // console.log(JSON.stringify(track, null, 4))
  await saveTrack(track)
  return 'preset finished running.'
}

export default go
