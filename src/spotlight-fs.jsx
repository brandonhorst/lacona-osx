/** @jsx createElement */
import _ from 'lodash'
import {createElement} from 'elliptical'
import {File, Directory} from 'lacona-phrases'
import {fetchFiles} from 'lacona-api'
import {basename, dirname} from 'path'
import {fromPromise} from 'rxjs/observable/fromPromise'
import {startWith} from 'rxjs/operator/startWith'

const Files = {
  fetch ({props}) {
    return fromPromise(fetchFiles({query: props.query}))::startWith([])
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
    .map(({path}) => ({text: basename(path), value: path, qualifiers: [dirname(path)]}))
    .value()
  return <list strategy='contain' items={items} limit={10} strategy='fuzzy' />
}

function describeFolders ({data}) {
  const items = _.chain(data)
    .filter(({contentType}) => contentType === 'public.folder')
    .map(({path}) => ({text: basename(path), value: path, qualifiers: [dirname(path)]}))
    .value()
  return <list strategy='contain' items={items} limit={10} strategy='fuzzy' />
}

export const SpotlightFile = {
  extends: [File],
  describe ({props}) {
    return (
      <label text='file'>
        <dynamic observe={observe} describe={describeFiles} greedy splitOn={props.splitOn} limit={1} />
      </label>
    )
  }
}

export const SpotlightDirectory = {
  extends: [Directory],
  describe ({props}) {
    return (
      <label text='folder'>
        <dynamic observe={observe} describe={describeFolders} greedy splitOn={props.splitOn} limit={1} />
      </label>
    )
  }
}