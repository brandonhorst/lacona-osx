/** @jsx createElement */
import _ from 'lodash'
import { createElement } from 'elliptical'
import { File as BaseFile } from 'lacona-phrases'
import { searchFiles } from 'lacona-api'
import { dirname, basename } from 'path'

const Files = {
  fetch ({props}) {
    return searchFiles({query: props.query})
  },
  clear: true
}

function observe (input) {
  if (input != null) {
    return <Files query={input.toLowerCase()} />
  }
}

function describeFiles ({data}) {
  const items = _.chain(data)
    .filter(({contentType}) => contentType !== 'public.folder')
    .map(({path}) => ({text: basename(path), value: path}))
    .value()
  return <list items={items} />
}

function describeFolders ({data}) {
  const items = _.chain(data)
    .filter(({contentType}) => contentType === 'public.folder')
    .map(({path}) => ({text: basename(path), value: path}))
    .value()
  return <list items={items} />
}

export const File = {
  extends: [BaseFile],
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
