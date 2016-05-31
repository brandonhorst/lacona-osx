/** @jsx createElement */
import _ from 'lodash'
import { createElement } from 'elliptical'
import { File, Directory } from 'lacona-phrases'
import { dirname, join } from 'path'
import { fetchDirectoryContents, userHome } from 'lacona-api'
import { Observable } from 'rxjs/Observable'

const DirectorySource = {
  fetch ({props}) {
    return new Observable((observer) => {
      observer.next([])

      fetchDirectoryContents({path: props.path}, (err, files) => {
        const absDirs = _.chain(files)
          .filter('isDir')
          .map(({file}) => join(props.path, file) + '/')
          .value()

        observer.next([props.path].concat(absDirs))
      })
    })
  }
}

const FileSource = {
  fetch ({props}) {
    return new Observable((observer) => {
      observer.next([])

      fetchDirectoryContents({path: props.path}, (err, files) => {
        const absFiles = _.chain(files)
          .filter(file => !file.isDir)
          .map(({file}) => join(props.path, file))
          .value()
        observer.next(absFiles)
      })
    })
  }
}

function observeFiles (input) {
  const path = _.endsWith(input, '/') ? input : dirname(input)
  return <FileSource path={path} />
}

function observeDirectories (input) {
  const path = _.endsWith(input, '/') ? input : dirname(input)
  return <DirectorySource path={path} />
}

function describeFile ({data}) {
  const items = _.map(data, (file) => ({text: file, value: file}))
  return <list items={items} />
}

export const FilePath = {
  extends: [File],
  
  describe () {
    return (
      <label text='path'>
        <dynamic observe={observeFiles} describe={describeFile} greedy limit={1} />
      </label>
    )
  }
}

export const DirectoryPath = {
  extends: [Directory],
  
  describe () {
    return (
      <label text='path'>
        <dynamic observe={observeDirectories} describe={describeFile} greedy limit={1} />
      </label>
    )
  }
}