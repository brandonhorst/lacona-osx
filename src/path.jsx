/** @jsx createElement */
import _ from 'lodash'
import { createElement } from 'elliptical'
import { File, Directory } from 'lacona-phrases'
import { dirname, join } from 'path'
import { Observable } from 'rxjs/Observable'
import { readdir, stat } from 'fs'

function fetchPath (dir, file) {
  return new Promise((resolve, reject) => {
    stat(join(dir, file), (err, stats) => {
      if (err) {
        reject(err)
      } else {
        resolve({
          file,
          isDir: stats.isDirectory()
        })
      }
    })
  })
}

function fetchDirectoryContents (dir) {
  return new Promise((resolve, reject) => {
    readdir(dir, (err, files) => {
      if (err) {
        reject(err)
      } else {
        const infoPromises = files.map(file => fetchPath(dir, file))
        resolve(Promise.all(infoPromises))
      }
    })
  })
}

const DirectorySource = {
  fetch ({props}) {
    return new Observable(async observer => {
      observer.next([])

      const files = await fetchDirectoryContents(props.path)
      const absDirs = _.chain(files)
        .filter('isDir')
        .map(({file}) => join(props.path, file) + '/')
        .value()

      observer.next([props.path].concat(absDirs))
    })
  }
}

const FileSource = {
  fetch ({props}) {
    return new Observable(async observer => {
      observer.next([])

      const files = await fetchDirectoryContents(props.path)
      const absFiles = _.chain(files)
        .filter(file => !file.isDir)
        .map(({file}) => join(props.path, file))
        .value()
      observer.next(absFiles)
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
  
  describe ({props}) {
    return (
      <label text='path'>
        <dynamic observe={observeFiles} describe={describeFile} greedy splitOn={props.splitOn} limit={1} />
      </label>
    )
  }
}

export const DirectoryPath = {
  extends: [Directory],
  
  describe ({props}) {
    return (
      <label text='path'>
        <dynamic observe={observeDirectories} describe={describeFile} greedy splitOn={props.splitOn} limit={1} />
      </label>
    )
  }
}