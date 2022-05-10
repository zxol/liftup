import test from 'ava'

import { readXMLFile, writeXMLFile } from '../../src/xml/xml.js'

test('read test file', async t => {
  const xmlObj = readXMLFile('./assets/testXML.xml')
  t.deepEqual(await xmlObj, {
    note: {
      to: 'Tove',
      from: 'Jani',
      heading: 'Reminder',
      body: "Don't forget me this weekend!"
    }
  })
})

test('write test file', async t => {
  const xmlObj = writeXMLFile({ hello: 'hi' }, './assets/tempwrite.xml')
  t.deepEqual(await xmlObj, '<hello>hi</hello>')
})
