/** @jsx createElement */
import {createElement, Phrase} from 'lacona-phrase'
import Spotlight from './spotlight'
import URL from 'lacona-phrase-url'


/* for when I want to support Chrome
tell application "Google Chrome"
	get {title, URL, id} of bookmark items of bookmark folders
end tell
*/

export default class Bookmark extends Phrase {
  source() {
    return {bookmarks: <Spotlight query="kMDItemContentTypeTree = 'com.apple.safari.bookmark'"
      attributes={['kMDItemDisplayName', 'kMDItemURL']}/>}
  }

  describe() {
    const bookmarks = this.sources.bookmarks.data.map(bookmark => ({text: bookmark.kMDItemDisplayName, value: bookmark.kMDItemURL}))

    return (
      <argument text='bookmark'>
        <list fuzzy={true} items={bookmarks} />
      </argument>
    )
  }
}
Bookmark.extends = [URL]
