/** @jsx createElement */
import _ from 'lodash'
import { createElement, Phrase, Source } from 'lacona-phrase'
import { File as BaseFile } from 'lacona-phrase-file'
import { dirname, join } from 'path'
import { fetchDirectoryContents, userHome } from 'lacona-api'

class Directory extends Source {
  onCreate () {
    fetchDirectoryContents({path: this.props.path}, (err, files) => {
      const absFiles = _.map(files, ({file, isDir}) => {
        return join(this.props.path, file) + (isDir ? '/' : '')
      })
      this.setData([this.props.path].concat(absFiles))
    })
  }
}

function observe (input) {
  const path = _.endsWith(input, '/') ? input : dirname(input)
  return <Directory path={path} />
}

function describe (data) {
  const items = _.map(data, (file) => ({text: file, value: file}))
  return <list items={items} />
}

export class Path extends Phrase {
  static extends = [BaseFile]

  describe (data = []) {
    return (
      <label text='path'>
        <dynamic observe={observe} describe={describe} greedy limit={1} />
      </label>
    )
  }
}

// class Directory extends Source {
//   data = []

//   onCreate () {
//     this.onActivate()
//   }

//   onActivate () {
//     fetchDirectoryContents({path: this.props.path}, (err, contents) => {
//       if (err) {
//         console.error(err)
//       } else {
//         this.setData(contents)
//       }
//     })
//   }
// }

// function processChildren (children) {
//   return _.map(children, child => {
//     if (_.isString(child)) {
//       return {file: child, isDir: false}
//     } else {
//       return {file: child.name, isDir: true, children: child.children}
//     }
//   })
// }

// class TrueFile extends Phrase {
//   observe () {
//     return <Directory path={this.props.directory} />
//   }

//   getValue (result) {
//     if (!result) return

//     return `${result.prefix || ''}${result.suffix || ''}`
//     // if (result && result.dir) {
//     //   return result.dir.prefix + result.dir.suffix
//     // } else if (result && result.file) {
//     //   return result.file
//     // }
//   }

//   describe () {
//     const dirElements = _.chain(this.source.data)
//       .map(({isDir, file}) => {
//         if (!isDir) return
//         const val = `${file}/`
//         const newDir = resolve(this.props.directory, file)

//         return (
//           <sequence>
//             <literal text={val} value={val} id='prefix' />
//             <TrueFile directory={`${newDir}/`} id='suffix'/>
//           </sequence>
//         )
//       })
//       .filter()
//       .value()

//     const fileItems = _.chain(this.source.data)
//       .map(({isDir, file}) => (
//         isDir ? null : {text: file, value: {suffix: file}}
//       ))
//       .filter()
//       .value()

//     return (
//       <map function={this.getValue.bind(this)}>
//         <choice>
//           <label text='directory' suppressEmpty={false}>
//             <choice>
//               <literal text='' value={{prefix: '', suffix: ''}} />
//               {dirElements}
//             </choice>
//           </label>
//           {fileItems.length > 0 ?
//             <label text='file' suppressEmpty={false}>
//               <list items={fileItems} />
//             </label> :
//             null
//           }
//         </choice>
//       </map>
//     )
//   }
// }

// class UserHome extends Source {
//   data = userHome()
// }

// export class Path extends Phrase {
//   static extends = [BaseFile]

//   observe () {
//     return <UserHome />
//   }

//   getValue (result) {
//     if (!result) return
//     return `${result.prefix || ''}${result.suffix || ''}`
//   }

//   describe () {
//     return (
//       <label text='path'>
//         <map function={this.getValue.bind(this)}>
//           <choice>
//             <sequence>
//               <literal text='/' value='/' id='prefix' />
//               <TrueFile directory='/' id='suffix' />
//             </sequence>
//             <sequence>
//               <literal text='~/' value={`${this.source.data}/`} id='prefix' />
//               <TrueFile directory={`${this.source.data}/`} id='suffix' />
//             </sequence>
//           </choice>
//         </map>
//       </label>
//     )
//   }
// }
