import repl from 'node:repl'
import fs from 'node:fs'
import path from 'node:path'
import { execSync } from 'node:child_process'
import { filter } from 'ramda'
import open from 'open'
import { padEnd } from 'ramda-adjunct'

import * as toolbox from './toolbox.js'

let replContext = {}
let myRepl = {}

// fs.watch('src/presets/', { recursive: true }, (event_type, file_name) => {
//   if (event_type === 'change') {
//     try {
//       delete require.cache[require.resolve(`./presets/${file_name}`)]
//     } catch (e) {
//       //error(e)
//     }
//   }
// })

const findPresetPath = presetNum => {
  const presetRegex = new RegExp('^' + presetNum.toString().padStart(2, '0'))
  const presetNames = fs.readdirSync(`./src/presets/`)
  const preset = filter(s => presetRegex.test(s), presetNames)[0]
  if (preset == undefined) {
    return `Error: Preset number ${presetNum} not found.`
  }
  const filePath = `./presets/${preset}`
  return filePath
}

replContext.runPreset = async presetNum => {
  const filePath = findPresetPath(presetNum)
  console.log(`  --- Running ${filePath} ---`)
  try {
    import(filePath).then(async m => {
      console.log(`\n${await m.go()}`)
      myRepl.displayPrompt(true)
    })
  } catch (e) {
    console.error(e)
  }
  return 'preset running...'
}
replContext.rp = replContext.runPreset
;(async () => {
  console.log('  ---   Welcome to the liftup repl   ---')
  myRepl = repl.start({
    terminal: true,
    preview: true,
    ignoreUndefined: true,
    prompt: 'repl >'
  })

  Object.assign(myRepl.context.global, toolbox.default, replContext)
})()
