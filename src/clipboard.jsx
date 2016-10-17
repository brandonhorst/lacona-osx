/** @jsx createElement */
import _ from 'lodash'
import {createElement} from 'elliptical'
import {String as StringPhrase, Directory, URL, File} from 'lacona-phrases'
import {join} from 'path'

const CLIPBOARD_ICON = join(__dirname, '../img/Cut-48.png')

export const ClipboardString = {
  extends: [StringPhrase],

  describe ({context}) {
    if (context.clipboard && context.clipboard.strings) {
      const topLevelChoices = _.map(context.clipboard.strings, string => {
        const noNewlinesString = string.replace(/(?:\r\n|\r|\n)/g, ' ')
        const choices = [<list
          items={['clipboard contents', 'clipboard']}
          category='symbol'
          qualifier={`${noNewlinesString.slice(0, 47)}...`}
          limit={1} />
        ]

        if (string.length < 50) {
          choices.unshift(<literal text={noNewlinesString} />
          )
        }

        return (
          <choice
            value={string}
            limit={1}
            argument='clipboard contents'
            annotation={{type: 'image', value: CLIPBOARD_ICON}}>
            {choices}
          </choice>
        )
      })

      return <choice>{topLevelChoices}</choice>
    }
  }
}

export const ClipboardURL = {
  extends: [URL],

  describe ({context}) {
    if (context.clipboard && context.clipboard.urls) {
      const topLevelChoices = _.map(context.clipboard.urls, url => (
        <choice
          value={url}
          argument='clipboard url'
          limit={1}
          annotation={{type: 'image', value: CLIPBOARD_ICON}}>
          <literal text={url} />
          <list
            items={['clipboard contents', 'clipboard']}
            category='symbol'
            qualifier={url}
            limit={1} />
        </choice>
      ))

      return <choice>{topLevelChoices}</choice>
    }
  }
}

export const ClipboardFile = {
  extends: [File],

  describe ({context}) {
    if (context.clipboard && context.clipboard.files) {
      const topLevelChoices = _.chain(context.clipboard.files)
        .reject(file => _.endsWith(file, '/'))
        .map(file => (
          <choice
            value={file}
            argument='clipboard file'
            limit={1}
            annotation={{type: 'image', value: CLIPBOARD_ICON}}>
            <literal text={file} />
            <list
              items={['clipboard contents', 'clipboard']}
              category='symbol'
              qualifier={file}
              limit={1} />
          </choice>
        )).value()

      return <choice>{topLevelChoices}</choice>
    }
  }
}


export const ClipboardDirectory = {
  extends: [Directory],

  describe ({context}) {
    if (context.clipboard && context.clipboard.files) {
      const topLevelChoices = _.chain(context.clipboard.files)
        .filter(file => _.endsWith(file, '/'))
        .map(file => (
          <choice
            value={file}
            argument='clipboard folder'
            limit={1}
            annotation={{type: 'image', value: CLIPBOARD_ICON}}>
            <literal text={file} />
            <list
              items={['clipboard contents', 'clipboard']}
              category='symbol'
              qualifier={file}
              limit={1} />
          </choice>
        )).value()

      return <choice>{topLevelChoices}</choice>
    }
  }
}