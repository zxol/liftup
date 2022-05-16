import test from 'ava'

import { readXMLFile, writeXMLFile, printXMLFile } from '../../src/xml/xml.js'

const testJSONObj = {
  note: {
    to: 'Tove',
    from: 'Jani',
    heading: 'Reminder',
    body: "Don't forget me this weekend!"
  }
}

test('read test file', async t => {
  const xmlObj = readXMLFile('./assets/testXML.xml')
  t.deepEqual(await xmlObj, testJSONObj)
})

test('Print template file', async t => {
  const xmlObj = printXMLFile('./assets/testXML.xml')
  t.deepEqual(await xmlObj, testJSONObj)
})

test('write test file', async t => {
  const xmlObj = writeXMLFile({ hello: 'hi' }, './assets/tempwrite.xml')
  t.is(await xmlObj, '<hello>hi</hello>\n')
})
