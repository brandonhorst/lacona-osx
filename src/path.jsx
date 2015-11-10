/** @jsx createElement */
import _ from 'lodash'
import {createElement, Phrase, Source} from 'lacona-phrase'
import SpotlightFetch from './spotlight-fetch'
import BaseFile from 'lacona-phrase-file'
import {resolve} from 'path'

class Directory extends Source {
  onCreate () {
    this.replaceData([])

    global.getDirectoryContents(this.props.path, (err, contents) => {
      if (!err) {
        this.replaceData(contents)
      }
    })
  }

  onDestroy () {

  }
}

class TrueFile extends Phrase {
  getValue (result) {
    if (!result) return

    return `${result.prefix || ''}${result.suffix || ''}`
    // if (result && result.dir) {
    //   return result.dir.prefix + result.dir.suffix
    // } else if (result && result.file) {
    //   return result.file
    // }
  }

  describe () {
    const dirElements = _.chain(this.sources.files.data)
      .map(({isDir, file}) => {
        if (!isDir) return
        const val = `${file}/`
        const newDir = resolve(this.props.directory, file)

        return (
          <sequence>
            <literal text={val} value={val} id='prefix' />
            <TrueFile directory={newDir} id='suffix'/>
          </sequence>
        )
      })
      .filter()
      .value()

    const fileItems = _.chain(this.sources.files.data)
      .map(({isDir, file}) => (
        isDir ? null : {text: file, value: {suffix: file}}
      ))
      .filter()
      .value()

    return (
      <choice>
        <argument text='directory'>
          <choice>
            <literal text='' value={{prefix: '', suffix: ''}} />
            {dirElements}
          </choice>
        </argument>
        {fileItems.length > 0 ?
          <argument text='file'>
            <list items={fileItems} />
          </argument> :
          null
        }
      </choice>
    )
  }

  source () {
    return {
      files: <Directory path={this.props.directory} />
    }
  }
}

export default class Path extends Phrase {
  getValue (result) {
    if (!result) return
    return `${result.prefix || ''}${result.suffix || ''}`
  }

  describe () {
    const userHome = global.getUserHome()

    return (
      <argument text='path' showForEmpty={true}>
        <choice>
          <sequence>
            <literal text='/' value='/' id='prefix' />
            <TrueFile directory='/' id='suffix' />
          </sequence>
          <sequence>
            <literal text='~/' value={`${userHome}/`} id='prefix' />
            <TrueFile directory={`${userHome}/`} id='suffix' />
          </sequence>
        </choice>
      </argument>
    )
  }
}

Path.extends = [BaseFile]
