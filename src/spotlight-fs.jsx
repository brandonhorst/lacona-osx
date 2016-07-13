/** @jsx createElement */
import _ from 'lodash'
import {createElement} from 'elliptical'
import {File, Directory} from 'lacona-phrases'
import {fetchFiles} from 'lacona-api'
import {basename, dirname, join} from 'path'
import {fromPromise} from 'rxjs/observable/fromPromise'
import {startWith} from 'rxjs/operator/startWith'

const Files = {
  fetch ({props}) {
    return fromPromise(fetchFiles({query: props.query}))::startWith([])
  },
  clear: true
}

function subPaths (dir) {
  const paths = []
  let oldPath
  while (true) {
    const base = basename(dir)
    const newPath = oldPath ? join(base, oldPath) : base
    oldPath = newPath
    paths.push(newPath)
    dir = dirname(dir)
    if (dir === '/' || dir === '.') {
      break
    }
  }

  return paths
}

function describeFiles (input, observe) {
  const data = input != null
    ? observe(<Files query={input.toLowerCase()} />)
    : []

  const items = _.chain(data)
    .filter(({contentType}) => contentType !== 'public.folder')
    .map(({path}) => ({
      text: basename(path),
      value: path,
      qualifiers: subPaths(dirname(path)),
      annotation: {type: 'icon', path: path}
    }))
    .value()
  return <list strategy='contain' items={items} limit={10} strategy='fuzzy' />
}

function describeFolders (input, observe) {
  const data = input != null
    ? observe(<Files query={input.toLowerCase()} />)
    : []

  const items = _.chain(data)
    .filter(({contentType}) => contentType === 'public.folder')
    .map(({path}) => ({
      text: basename(path),
      value: path,
      qualifiers: subPaths(dirname(path)),
      annotation: {type: 'icon', path: path}
    }))
    .value()
  return <list strategy='contain' items={items} limit={10} strategy='fuzzy' />
}

export const SpotlightFile = {
  extends: [File],
  describe ({props, observe}) {
    return (
      <placeholder argument='file'>
        <dynamic
          describe={input => describeFiles(input, observe)}
          greedy
          splitOn={props.splitOn}
          limit={1} />
      </placeholder>
    )
  }
}

export const SpotlightDirectory = {
  extends: [Directory],
  describe ({props, observe}) {
    return (
      <placeholder argument='folder'>
        <dynamic
          describe={input => describeFolders(input, observe)}
          greedy
          splitOn={props.splitOn}
          limit={1} />
      </placeholder>
    )
  }
}