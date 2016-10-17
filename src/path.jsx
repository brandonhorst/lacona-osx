/** @jsx createElement */
import _ from 'lodash'
import { createElement } from 'elliptical'
import { File, Directory } from 'lacona-phrases'
import { dirname, join } from 'path'
import { Observable } from 'rxjs/Observable'
import { userHome } from 'lacona-api'
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

      const expandedPath = props.path.replace(/^~/, userHome())
      const files = await fetchDirectoryContents(expandedPath)
      const absDirs = _.chain(files)
        .filter('isDir')
        .map(({file}) => ({
          text: join(props.path, file) + '/',
          value: join(expandedPath, file) + '/'
        }))
        .value()

      observer.next([{text: props.path, value: expandedPath}].concat(absDirs))
    })
  },
  clear: true
}

const FileSource = {
  fetch ({props}) {
    return new Observable(async observer => {
      observer.next([])

      const expandedPath = props.path.replace(/^~/, userHome())
      const files = await fetchDirectoryContents(expandedPath)
      const absFiles = _.chain(files)
        .filter(file => !file.isDir)
        .map(({file}) => ({
          text: join(props.path, file),
          value: join(expandedPath, file)
        }))
        .value()
      observer.next(absFiles)
    })
  },
  clear: true
}

// function observeFiles (input) {
//   const path = _.endsWith(input, '/') ? input : dirname(input)
//   return <FileSource path={path} />
// }

// function observeDirectories (input) {
//   const path = _.endsWith(input, '/') ? input : dirname(input)
//   return <DirectorySource path={path} />
// }

function describeFile (input, observe, Source) {
  if (/^(~\/|\/)/.test(input)) {
    const path = _.endsWith(input, '/') ? input : dirname(input)
    const data = observe(<Source path={path} />)
    const items = _.map(data, ({text, value}) => ({
      text,
      value,
      annotation: {type: 'icon', value}
    }))
    return <list items={items} />
  }
}

export const FilePath = {
  extends: [File],
  
  describe ({props, observe}) {
    return (
      <placeholder argument='path'>
        <dynamic
          describe={input => describeFile(input, observe, FileSource)}
          greedy
          splitOn={props.splitOn}
          limit={1} />
      </placeholder>
    )
  }
}

export const DirectoryPath = {
  extends: [Directory],
  
  describe ({props, observe}) {
    return (
      <placeholder argument='path'>
        <dynamic
          describe={input => describeFile(input, observe, DirectorySource)}
          greedy
          splitOn={props.splitOn}
          limit={1} />
      </placeholder>
    )
  }
}