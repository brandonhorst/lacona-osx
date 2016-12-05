/** @jsx createElement */
import _ from 'lodash'
import {createElement} from 'elliptical'
import {File, Directory} from 'lacona-phrases'
import {fetchFiles} from 'lacona-api'
import {basename, dirname} from 'path'
import {fromPromise} from 'rxjs/observable/fromPromise'
import {startWith} from 'rxjs/operator/startWith'
import {subPaths} from './utils'

const Files = {
  fetch ({props}) {
    return fromPromise(fetchFiles({query: props.query}))::startWith([])
  },
  clear: true
}

function describeFiles (input, observe) {
  const data = input != null
    ? observe(<Files query={input.toLowerCase()} />)
    : []

  const items = _.chain(data)
    .filter(({contentType}) => contentType !== 'public.folder')
    .filter('path')
    .map(({path}) => ({
      text: basename(path),
      value: path,
      qualifiers: subPaths(dirname(path)),
      annotation: {type: 'icon', value: path}
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
    .filter('path')
    .map(({path}) => ({
      text: basename(path),
      value: path,
      qualifiers: subPaths(dirname(path)),
      annotation: {type: 'icon', value: path}
    }))
    .value()
  return <list strategy='contain' items={items} limit={10} strategy='fuzzy' />
}

export const SpotlightFile = {
  extends: [File],
  describe ({props, observe, config}) {
    if (config.enableSpotlightFiles) {
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
}

export const SpotlightDirectory = {
  extends: [Directory],
  describe ({props, observe, config}) {
    if (config.enableSpotlightDirectories) {
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
}