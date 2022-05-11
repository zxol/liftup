import test from 'ava'

import { makeTrack } from '../../src/track/track.js'
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
