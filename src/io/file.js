import { readFile as nodeReadFile, writeFile as nodeWriteFile } from 'node:fs/promises'

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
