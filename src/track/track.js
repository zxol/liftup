import { readJSONFile, makeFolder } from '../io/file.js'
import { mergeDeepLeft, map, pipe } from 'ramda'
import { writeXMLFile } from '../xml/xml.js'
import { removeSuperimposedBlueprints, validateTransformBlueprint } from './blueprint.js'

const TEMPLATE_FILE = './assets/template.json'
const TRACKS_DIR = './assets/Tracks'

export const makeTrack = async (name = 'trackname') => {
  const template = mergeDeepLeft(
    {
      Track: {
        name,
        lastTrackItemID: 0,
        localID: { str: name }
      }
    },
    await readJSONFile(TEMPLATE_FILE)
  )
  Object.defineProperty(template, 'items', {
    get: function () {
      return this.Track.blueprints.TrackBlueprint
    },
    set: function (arr) {
      this.Track.blueprints.TrackBlueprint = arr
    }
  })

  return template
}

export const addBlueprint = (track, blueprint) => {
  // blueprint.instanceID = ++track.Track.lastTrackItemID
  // liftoff level loader seems to include self healing item IDs, don't need them.
  track.items.push(blueprint)
  console.log(track)
  console.log(JSON.stringify(track, null, 4))
  return track
}

export const saveTrack = async track => {
  track.items = pipe(removeSuperimposedBlueprints, map(validateTransformBlueprint))(track.items)
  const trackName = track.Track.localID.str
  const folderName = `${TRACKS_DIR}/${trackName}`
  makeFolder(folderName)
  return writeXMLFile(track, `${folderName}/${trackName}.track`)
}
