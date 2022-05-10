import { readJSONFile } from '../io/file.js'
import { mergeLeft } from 'ramda'

const TEMPLATE_FILE = '../../assets/template.json'

export const makeTrack = async (name = 'trackname') => {
  const template = mergeLeft(
    {
      Track: {
        name,
        lastTrackItemID: 0,
        localID: { str: name }
      }
    },
    await readJSONFile(TEMPLATE_FILE)
  )
  return template
}
