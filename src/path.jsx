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
}

function processChildren (children) {
  return _.map(children, child => {
    if (_.isString(child)) {
      return {file: child, isDir: false}
    } else {
      return {file: child.name, isDir: true, children: child.children}
    }
  })
}

class DemoDirectory extends Source {
  onCreate () {
    const components = this.props.path.split('/')
    console.log(components)
    let contents = processChildren(global.config.rootFiles)
    for (let component in components.slice(1)) {
      const theDir = _.find(contents, child => child.name === component)
      if (theDir) {
        contents = processChildren(theDir.children)
      } else {
        this.replaceData([])
        return
      }
    }

    this.replaceData(contents)
  }
}

class TrueFile extends Phrase {
  source () {
    if (process.env.LACONA_ENV === 'demo') {
      return {
        files: <DemoDirectory path={this.props.directory} />
      }
    } else {
      return {
        files: <Directory path={this.props.directory} />
      }
    }
  }

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
}

class UserHome extends Source {
  onCreate () {
    if (process.env.LACONA_ENV === 'demo') {
      this.replaceData('/Users/LaconaUser')
    } else {
      this.replaceData(global.getUserHome())
    }
  }
}

export default class Path extends Phrase {
  source () {
    return {userHome: <UserHome />}
  }

  getValue (result) {
    if (!result) return
    return `${result.prefix || ''}${result.suffix || ''}`
  }

  describe () {
    return (
      <argument text='path' showForEmpty={true}>
        <choice>
          <sequence>
            <literal text='/' value='/' id='prefix' />
            <TrueFile directory='' id='suffix' />
          </sequence>
          <sequence>
            <literal text='~/' value={`${this.sources.userHome.data}/`} id='prefix' />
            <TrueFile directory={`${this.sources.userHome.data}/`} id='suffix' />
          </sequence>
        </choice>
      </argument>
    )
  }
}

Path.extends = [BaseFile]
