/** @jsx createElement */
import {createElement} from 'elliptical'
import {Directory} from 'lacona-phrases'
import {userHome} from 'lacona-api'

export const ContextDirectory = {
  extends: [Directory],

  describe ({context}) {
    if (context.directory && context.directory.path) {
      const expandedPath = context.directory.path.replace(/^~/, userHome())
      return (
        <literal
          text={context.directory.path}
          value={expandedPath}
          argument={context.directory.argument || 'directory'}
          annotation={{type: 'icon', value: '/System/Library/CoreServices/Finder.app'}} />
      )
    }
  }
}
