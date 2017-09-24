// /** @jsx createElement */
// import _ from 'lodash'
// import { createElement } from 'elliptical'
// import { URL } from 'lacona-phrases'
// import { watchBookmarks } from 'lacona-api'
// import { map } from 'rxjs/operator/map'
//
// export const BookmarkSource = {
//   fetch () {
//     return watchBookmarks()
//   }
// }
//
// export const Bookmark = {
//   extends: [URL],
//
//   describe ({observe, config}) {
//     if (config.enableSafariBookmarks) {
//       const data = observe(<BookmarkSource />)
//       console.log(JSON.stringify(data, null, 1))
//       const bookmarks = _.chain(data)
//         .filter()
//         .filter('name')
//         .filter('url')
//         .map(bookmark => ({
//           text: bookmark.name,
//           value: bookmark.url,
//           annotation: {type: 'icon', value: '/Applications/Safari.app'}
//         }))
//         .value()
//
//       return (
//         <placeholder argument='bookmark'>
//           <list strategy='fuzzy' items={bookmarks} limit={10} />
//         </placeholder>
//       )
//     }
//   }
// }
