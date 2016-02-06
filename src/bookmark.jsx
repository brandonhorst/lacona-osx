/** @jsx createElement */
import { createElement, Phrase, Source } from 'lacona-phrase'
import { URL } from 'lacona-phrase-url'
import { fetchBookmarks } from 'lacona-api'

/* for when I want to support Chrome
tell application "Google Chrome"
	get {title, URL, id} of bookmark items of bookmark folders
end tell
*/

class Bookmarks extends Source {
  data = []

  onCreate () {
    this.query = fetchBookmarks()
      .on('data', (data) => {
        this.setData(data)
      }).on('error', (err) => {
        console.error(err)
        this.setData([])
      })
  }

  onDestroy () {
    this.query.cancel()
    delete this.query
  }
}

export class Bookmark extends Phrase {
  static extends = [URL]
  observe () {
    return <Bookmarks />
  }

  describe () {
    const bookmarks = this.source.data.map(bookmark => ({text: bookmark.name, value: bookmark.url}))

    return (
      <label text='bookmark'>
        <list fuzzy items={bookmarks} limit={10} />
      </label>
    )
  }
}
