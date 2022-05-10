import { XMLParser, XMLBuilder, XMLValidator } from 'fast-xml-parser'
import { readFile, writeFile } from '../io/file.js'

export const readXMLFile = async fileName => {
  const promise = readFile(fileName)
  const parser = new XMLParser()
  const xmlJsObj = parser.parse(await promise)
  return xmlJsObj
}

export const writeXMLFile = async (xmlJsObj, fileName) => {
  const builder = new XMLBuilder()
  const xmlContent = builder.build(xmlJsObj)
  return writeFile(fileName, xmlContent)
}

export default { readXMLFile, writeXMLFile }
