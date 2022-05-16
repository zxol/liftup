import { XMLParser, XMLBuilder, XMLValidator } from 'fast-xml-parser'
import { readFile, writeFile } from '../io/file.js'

const parserOptions = {
  ignoreAttributes: false
}

const builderOptions = {
  format: true,
  ignoreAttributes: false
}

export const readXMLFile = async fileName => {
  const promise = readFile(fileName)
  const parser = new XMLParser(parserOptions)
  const xmlJsObj = parser.parse(await promise)
  return xmlJsObj
}

export const printXMLFile = async fileName => {
  const promise = readFile(fileName)
  const parser = new XMLParser(parserOptions)
  const xmlJsObj = parser.parse(await promise)
  console.log(JSON.stringify(xmlJsObj, null, 4))
  return xmlJsObj
}

export const writeXMLFile = async (xmlJsObj, fileName) => {
  const builder = new XMLBuilder(builderOptions)
  const xmlContent = builder.build(xmlJsObj)
  return writeFile(fileName, xmlContent)
}

export default { readXMLFile, printXMLFile, writeXMLFile }
