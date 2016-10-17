/** @jsx createElement */
import { createElement } from 'elliptical'
import { URL } from 'lacona-phrases'
import { watchBookmarks } from 'lacona-api'
import { map } from 'rxjs/operator/map'

/* for when I want to support Chrome
tell application "Google Chrome"
	get {title, URL, id} of bookmark items of bookmark folders
end tell
*/

const Bookmarks = {
  fetch () {
    return watchBookmarks()
  }
}

export const Bookmark = {
  extends: [URL],

  describe ({observe}) {
    const data = observe(<Bookmarks />)
    const bookmarks = data.map(bookmark => ({
      text: bookmark.name,
      value: bookmark.url,
      annotation: {type: 'icon', value: bookmark.path}
    }))

    return (
      <placeholder argument='bookmark'>
        <list strategy='fuzzy' items={bookmarks} limit={10} />
      </placeholder>
    )
  }
}
