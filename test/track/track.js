import test from 'ava'

import { makeTrack, addBlueprint, saveTrack } from '../../src/track/track.js'
import { makeBlueprint } from '../../src/track/blueprint.js'

const testTrackData = {
  Track: {
    name: 'testTrack',
    lastTrackItemID: 0,
    localID: { str: 'testTrack', version: 1, type: 'TRACK' },
    gameVersion: '1.4.5',
    description: '',
    dependencies: '',
    environment: 'TheDrawingBoard',
    blueprints: { TrackBlueprint: [] },
    hideDefaultSpawnpoint: false,
    '@_xmlns:xsd': 'http://www.w3.org/2001/XMLSchema',
    '@_xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance'
  },
  '?xml': { '@_version': '1.0', '@_encoding': 'utf-16' }
}
test('make new track object', async t => {
  const track = await makeTrack('testTrack')
  t.deepEqual(await track, testTrackData)
})

test('add blueprint to track', async t => {
  let track = await makeTrack('testTrack')
  const blueprint = makeBlueprint('cube1')
  const blueprint2 = makeBlueprint('cylinder0')
  track = addBlueprint(track, blueprint)
  track = addBlueprint(track, blueprint2)
  t.pass()
})

test('save track', async t => {
  let track = await makeTrack('monono')
  const blueprint = makeBlueprint('cube1', [10, 0, 0])
  const blueprint2 = makeBlueprint('cylinder0', [0, 0, 10])
  track = addBlueprint(track, blueprint)
  track = addBlueprint(track, blueprint2)
  await saveTrack(track)
  t.pass()
})
