import test from 'ava'

import { makeBlueprint } from '../../src/track/blueprint.js'
const testBlueprintData = {
  itemID: 'DrawingBoardCube1mx1m04',
  // "instanceID": 0,
  position: {
    x: 0,
    y: 0,
    z: 0
  },
  rotation: {
    x: 0,
    y: 0,
    z: 0
  },
  purpose: 'Functional',
  '@_xsi:type': 'TrackBlueprintFlag'
}
test('make new blueprint object', t => {
  const blueprint = makeBlueprint('cube1')
  t.deepEqual(blueprint, testBlueprintData)
})
