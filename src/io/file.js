import { readFile as nodeReadFile, writeFile as nodeWriteFile } from 'node:fs/promises'
import { existsSync, mkdirSync } from 'node:fs'

export const readFile = async (filename, encoding = 'utf8') => {
  try {
    const promise = nodeReadFile(filename, encoding)
    return promise
  } catch (err) {
    console.error(err)
  }
  return false
}

export const writeFile = async (filename, data, options = { encoding: 'utf8' }) => {
  try {
    const promise = nodeWriteFile(filename, data, options)
    return data
  } catch (err) {
    console.error(err)
  }
  return null
}

export const readJSONFile = async filename => {
  // return import(filename)
  const fileString = readFile(filename)
  return JSON.parse(await fileString)
}

export const makeFolder = path => {
  return !existsSync(path) && mkdirSync(path)
}
