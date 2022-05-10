import { XMLParser, XMLBuilder, XMLValidator } from 'fast-xml-parser'
import { readFile, writeFile } from '../io/file.js'

const options = {
  ignoreAttributes: false
}

export const readXMLFile = async fileName => {
  const promise = readFile(fileName)
  const parser = new XMLParser(options)
  const xmlJsObj = parser.parse(await promise)
  return xmlJsObj
}

export const printXMLFile = async fileName => {
  const promise = readFile(fileName)
  const parser = new XMLParser(options)
  const xmlJsObj = parser.parse(await promise)
  console.log(JSON.stringify(xmlJsObj, null, 4))
  return xmlJsObj
}

export const writeXMLFile = async (xmlJsObj, fileName) => {
  const builder = new XMLBuilder()
  const xmlContent = builder.build(xmlJsObj)
  return writeFile(fileName, xmlContent)
}

export default { readXMLFile, printXMLFile, writeXMLFile }
