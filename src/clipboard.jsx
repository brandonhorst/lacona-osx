/** @jsx createElement */
import _ from 'lodash'
import {createElement} from 'elliptical'
import {String as StringPhrase, Directory, URL, File} from 'lacona-phrases'
import {fetchClipboard} from 'lacona-api'
import {onActivate} from 'lacona-source-helpers'
import {join} from 'path'

const CLIPBOARD_ICON = join(__dirname, '../img/Cut-48.png')

const ClipboardSource = onActivate(fetchClipboard, {})

export const ClipboardString = {
  extends: [StringPhrase],

  describe ({config, observe}) {
    if (!config.enableClipboardText) return

    const clipboard = observe(<ClipboardSource />)

    if (clipboard.strings && clipboard.strings.length > 0) {

      const items = _.chain(clipboard.strings)
        .map(string => {
          const noNewlinesString = string.replace(/(?:\r\n|\r|\n)/g, ' ')
          const qualifier = string.length < 50 ? string : `${noNewlinesString.slice(0, 47)}...`
          const items = [
            {text: 'clipboard string', value: string, qualifier, category: 'symbol'},
            {text: 'clipboard contents', value: string, qualifier, category: 'symbol'},
            {text: 'clipboard', value: string, qualifier, category: 'symbol'}
          ]
          if (string.length < 50) {
            items.unshift({text: noNewlinesString, value: string})
          }

          return items
        })
        .flatten()
        .value()

      return (
        <placeholder argument='clipboard string' suppressEmpty={false}>
          <list items={items} unique annotation={{type: 'image', value: CLIPBOARD_ICON}} limit={1} />
        </placeholder>
      )
    }
  }
}

export const ClipboardURL = {
  extends: [URL],

  describe ({config, observe}) {
    if (!config.enableClipboardURLs) return

    const clipboard = observe(<ClipboardSource />)

    if (clipboard.urls && clipboard.urls.length > 0) {
      const items = _.chain(clipboard.urls)
        .map(url => {
          const items = [
            {text: 'clipboard url', value: url, qualifier: url, category: 'symbol'},
            {text: 'clipboard contents', value: url, qualifier: url, category: 'symbol'},
            {text: 'clipboard', value: url, qualifier: url, category: 'symbol'}
          ]

          if (url.length < 50) {
            items.unshift({text: url, value: url})
          }

          return items
        })
        .flatten()
        .value()

      return (
        <placeholder argument='clipboard url' suppressEmpty={false}>
          <list items={items} unique annotation={{type: 'image', value: CLIPBOARD_ICON}} limit={1} />
        </placeholder>
      )
    }
  }
}

function describeClipboardFS (observe, config, filter, argument) {
  if (!config.enableClipboardFiles) return

  const clipboard = observe(<ClipboardSource />)

  if (clipboard.files && clipboard.files.length > 0) {
    const items = _.chain(clipboard.files)
      .filter(file => filter(file))
      .map(file => ([
        {text: file, value: file},
        {text: argument, value: file, category: 'symbol'},
        {text: 'clipboard contents', value: file, category: 'symbol'},
        {text: 'clipboard', value: file, category: 'symbol'}
      ]))
      .flatten()
      .value()

    return (
      <placeholder argument={argument} suppressEmpty={false}>
        <list items={items} unique annotation={{type: 'image', value: CLIPBOARD_ICON}} limit={1} />
      </placeholder>
    )
  }
}

export const ClipboardFile = {
  extends: [File],

  describe ({config, observe}) {
    return describeClipboardFS(observe, config, file => !_.endsWith(file, '/'), 'clipboard file')
  }
}


export const ClipboardDirectory = {
  extends: [Directory],

  describe ({config, observe}) {
    return describeClipboardFS(observe, config, file => _.endsWith(file, '/'), 'clipboard directory')
  }
}