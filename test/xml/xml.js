import test from 'ava'

import { readXMLFile, writeXMLFile, printXMLFile } from '../../src/xml/xml.js'

test('read test file', async t => {
  const xmlobj = readXMLFile('./assets/testXML.xml')
  t.deepEqual(await xmlobj, {
    note: {
      to: 'tove',
      from: 'jani',
      heading: 'reminder',
      body: "don't forget me this weekend!"
    }
  })
})

test('Print template file', async t => {
  const xmlobj = printXMLFile('./assets/template.track')
  t.deepEqual(await xmlobj, {
    note: {
      to: 'tove',
      from: 'jani',
      heading: 'reminder',
      body: "don't forget me this weekend!"
    }
  })
})

test('write test file', async t => {
  const xmlObj = writeXMLFile({ hello: 'hi' }, './assets/tempwrite.xml')
  t.deepEqual(await xmlObj, '<hello>hi</hello>')
})
