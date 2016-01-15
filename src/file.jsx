/** @jsx createElement */
import _ from 'lodash'
import { createElement, Phrase, Source } from 'lacona-phrase'
import { File as BaseFile } from 'lacona-phrase-file'
import { searchFiles } from 'lacona-api'
import { dirname, basename } from 'path'

class Files extends Source {
  static preventSharing = true

  data = []

  fetch (input) {
    searchFiles(input, (err, files) => {
      if (err) {
        console.error(err)
      } else {
        if (!_.isEqual(files, this.data)) {
          this.setData(files)
        }
      }
    })
  }
}

export class File extends Phrase {
  static extends = [BaseFile]

  observe () {
    return <Files />
  }

  describe () {
    const files = _.map(this.source.data, ({path}) => {
      return (
        <sequence value={path}>
          <literal decorate allowInput={false} text={`${dirname(path)}/`} />
          <literal text={basename(path)} />
        </sequence>
      )
    })

    return (
      <label text='file'>
        <tap function={this.source.fetch.bind(this.source)}>
          <choice>{files}</choice>
        </tap>
      </label>
    )
  }
}
