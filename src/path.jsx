/** @jsx createElement */
import _ from 'lodash'
import { createElement } from 'elliptical'
import { File as BaseFile } from 'lacona-phrases'
import { dirname, join } from 'path'
import { fetchDirectoryContents, userHome } from 'lacona-api'
import { Observable } from 'rxjs/Observable'

const Directory = {
  fetch ({props}) {
    return new Observable((observer) => {
      observer.next([])

      fetchDirectoryContents({path: props.path}, (err, files) => {
        console
        const absFiles = _.map(files, ({file, isDir}) => {
          return join(props.path, file) + (isDir ? '/' : '')
        })
        observer.next([props.path].concat(absFiles))
      })
    })
  },
  clear: true
}

function observe (input) {
  const path = _.endsWith(input, '/') ? input : dirname(input)
  return <Directory path={path} />
}

function describe ({data}) {
  const items = _.map(data, (file) => ({text: file, value: file}))
  return <list items={items} />
}

export const Path = {
  extends: [BaseFile],
  
  describe () {
    return (
      <label text='path'>
        <dynamic observe={observe} describe={describe} greedy limit={1} />
      </label>
    )
  }
}
