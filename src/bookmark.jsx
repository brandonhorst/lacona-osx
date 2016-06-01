/** @jsx createElement */
import { createElement } from 'elliptical'
import { URL } from 'lacona-phrases'
import { fetchBookmarks } from 'lacona-api'
import { map } from 'rxjs/operator/map'

/* for when I want to support Chrome
tell application "Google Chrome"
	get {title, URL, id} of bookmark items of bookmark folders
end tell
*/

const Bookmarks = {
  fetch () {
    return fetchBookmarks()
  }
}

export const Bookmark = {
  extends: [URL],
  observe () {
    return <Bookmarks />
  },

  describe ({data}) {
    const bookmarks = data.map(bookmark => ({text: bookmark.name, value: bookmark.url}))

    return (
      <label text='bookmark'>
        <list strategy='fuzzy' items={bookmarks} limit={10} />
      </label>
    )
  }
}
