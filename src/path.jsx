/** @jsx createElement */
import _ from 'lodash'
import { createElement, Phrase, Source } from 'lacona-phrase'
import { File as BaseFile } from 'lacona-phrase-file'
import { resolve } from 'path'
import { fetchDirectoryContents, userHome } from 'lacona-api'

class Directory extends Source {
  data = []

  onCreate () {
    this.onActivate()
  }

  onActivate () {
    fetchDirectoryContents({path: this.props.path}, (err, contents) => {
      if (err) {
        console.error(err)
      } else {
        this.setData(contents)
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

class TrueFile extends Phrase {
  observe () {
    return <Directory path={this.props.directory} />
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
    const dirElements = _.chain(this.source.data)
      .map(({isDir, file}) => {
        if (!isDir) return
        const val = `${file}/`
        const newDir = resolve(this.props.directory, file)

        return (
          <sequence>
            <literal text={val} value={val} id='prefix' />
            <TrueFile directory={`${newDir}/`} id='suffix'/>
          </sequence>
        )
      })
      .filter()
      .value()

    const fileItems = _.chain(this.source.data)
      .map(({isDir, file}) => (
        isDir ? null : {text: file, value: {suffix: file}}
      ))
      .filter()
      .value()

    return (
      <map function={this.getValue.bind(this)}>
        <choice>
          <label text='directory'>
            <choice>
              <literal text='' value={{prefix: '', suffix: ''}} />
              {dirElements}
            </choice>
          </label>
          {fileItems.length > 0 ?
            <label text='file'>
              <list items={fileItems} />
            </label> :
            null
          }
        </choice>
      </map>
    )
  }
}

class UserHome extends Source {
  data = userHome()
}

export class Path extends Phrase {
  static extends = [BaseFile]

  observe () {
    return <UserHome />
  }

  getValue (result) {
    if (!result) return
    return `${result.prefix || ''}${result.suffix || ''}`
  }

  describe () {
    return (
      <label text='path'>
        <map function={this.getValue.bind(this)}>
          <choice>
            <sequence>
              <literal text='/' value='/' id='prefix' />
              <TrueFile directory='/' id='suffix' />
            </sequence>
            <sequence>
              <literal text='~/' value={`${this.source.data}/`} id='prefix' />
              <TrueFile directory={`${this.source.data}/`} id='suffix' />
            </sequence>
          </choice>
        </map>
      </label>
    )
  }
}
