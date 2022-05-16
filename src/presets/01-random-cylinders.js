import { randomRangeI, randomRange } from '../utils/random.js'
import { makeTrack, saveTrack } from '../track/track.js'
import { makeBlueprint, makeSpawnPoint } from '../track/blueprint.js'
import { times, filter } from 'ramda'
export const go = async () => {
  let track = await makeTrack('randomcyl')

  const density = 1
  const len = 60
  const angle = Math.PI

  track.items = filter(
    b => b.position.y > 0,
    times(
      i =>
        makeBlueprint(
          'cylinder0',
          [randomRange(-len, len), randomRange(-len, len), randomRange(-len, len)],
          [randomRange(-angle, angle), randomRange(-angle, angle), randomRange(-angle, angle)]
        ),
      parseInt(len * len * (len / 2) * density * 0.1)
    )
  )
  track.items.push(makeSpawnPoint([0, 0, -100]))
  track.Track.hideDefaultSpawnpoint = true

  // console.log(JSON.stringify(track, null, 4))
  await saveTrack(track)
}

export default go
