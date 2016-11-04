/** @jsx createElement */
import { createElement } from 'elliptical'
import { URL } from 'lacona-phrases'
import { watchBookmarks } from 'lacona-api'
import { map } from 'rxjs/operator/map'

export const BookmarkSource = {
  fetch () {
    return watchBookmarks()
  }
}

export const Bookmark = {
  extends: [URL],

  describe ({observe, config}) {
    if (config.enableSafariBookmarks) {
      const data = observe(<BookmarkSource />)
      const bookmarks = data.map(bookmark => ({
        text: bookmark.name,
        value: bookmark.url,
        annotation: {type: 'icon', value: '/Applications/Safari.app'}
      }))

      return (
        <placeholder argument='bookmark'>
          <list strategy='fuzzy' items={bookmarks} limit={10} />
        </placeholder>
      )
    }
  }
}
