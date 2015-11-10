/** @jsx createElement */

import {createElement, Phrase} from 'lacona-phrase'
import {Parser} from 'lacona'
import {spy} from 'sinon'
import {Spotlight} from '..'

describe('Spotlight', () => {
  let parser

  beforeEach(() => {
    parser = new Parser()
  })

  it('does things', done => {
    const source = new Spotlight()
    source.props = {
      query: 'kind:application',
      attributes: ['kMDItemAppStoreCategory', 'kMDItemCFBundleIdentifier']
    }
    const dataSpy = spy()

    source.replaceData = arg => {
      dataSpy()
      if (dataSpy.calledTwice) {
        done()
      }
    }

    source.create()
  })
})
