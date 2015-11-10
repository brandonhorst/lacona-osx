/** @jsx createElement */
import {createElement, Phrase} from 'lacona-phrase'
import SpotlightFetch from './spotlight-fetch'
import BaseFile from 'lacona-phrase-file'
import {dirname, basename} from 'path'

export default class File extends Phrase {
  source () {
    return {
      files: <SpotlightFetch attributes={['kMDItemPath', 'kMDItemContentType']} limit={10} />
    }
  }

  fetch (input) {
    if (input === '') return
    this.sources.files.fetch(
      `kMDItemFSName contains[cd] "${input}" && ` +
      'kMDItemSupportFileType != "MDSystemFile" && ' +
      'kMDItemContentTypeTree != "com.apple.application" && ' +
      'kMDItemContentTypeTree != "com.apple.application-bundle" && ' +
      'kMDItemContentTypeTree != "com.apple.safari.bookmark" && ' +
      'kMDItemContentTypeTree != "public.contact" && ' +
      'kMDItemContentTypeTree != "com.apple.safari.history" && ' +
      'kMDItemContentTypeTree != "public.calendar-event" && ' +
      'kMDItemContentTypeTree != "com.apple.ichat.transcript"'
    )
  }

  describe () {
    const files = this.sources.files.data.map(({kMDItemPath, kMDItemContentType}) => {
      return (
        <sequence value={kMDItemPath}>
          <decorator allowInput={false} text={`${dirname(kMDItemPath)}/`} />
          <literal text={basename(kMDItemPath)} />
        </sequence>
      )
    })

    return (
      <argument text='file' trigger={this.fetch.bind(this)}>
        <choice>{files}</choice>
      </argument>
    )
  }
}
File.extends = [BaseFile]
