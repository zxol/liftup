import test from 'ava'

import { makeTrack } from '../../src/track/track.js'

test('make new track object', async t => {
  const track = await makeTrack('testTrack')
  console.log(track)
  t.deepEqual(await track)
})
