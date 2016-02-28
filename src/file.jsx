/** @jsx createElement */
import _ from 'lodash'
import { createElement, Phrase, Source } from 'lacona-phrase'
import { File as BaseFile } from 'lacona-phrase-file'
import { searchFiles } from 'lacona-api'
import { dirname, basename } from 'path'

class Files extends Source {
  data = []

  onCreate () {
    this.query = searchFiles({query: this.props.query})
      .on('data', (data) => {
        this.setData(data)
      }).on('error', (err) => {
        console.log(err)
        this.setData([])
      })
  }

  onDestroy () {
    this.query.cancel()
    delete this.query
  }
}


function observe (input) {
  if (input != null) {
    return <Files query={input.toLowerCase()} />
  }
}

function describeFiles (data) {
  const items = _.chain(data)
    .filter(({contentType}) => contentType !== 'public.folder')
    .map(({path}) => ({text: basename(path), value: path}))
    .value()
  return <list items={items} />
}

function describeFolders (data) {
  const items = _.chain(data)
    .filter(({contentType}) => contentType === 'public.folder')
    .map(({path}) => ({text: basename(path), value: path}))
    .value()
  return <list items={items} />
}

export class File extends Phrase {
  static extends = [BaseFile]

  describe () {
    return (
      <choice>
        <label text='folder'>
          <dynamic observe={observe} describe={describeFolders} greedy />
        </label>
        <label text='file'>
          <dynamic observe={observe} describe={describeFiles} greedy />
        </label>
      </choice>
    )
  }
}
