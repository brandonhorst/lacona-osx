
export {default as Applescript} from './applescript'
export {default as Spotlight} from './spotlight'

import App from './app'
import Bookmark from './bookmark'
import Birthday from './birthday'
import BrowserTab from './browser-tab'
import {ContactDate, ContactEmail, ContactPhoneNumber} from './contact'
import {RelationshipDate, RelationshipPhoneNumber, RelationshipEmail} from './relationship'
import File from './file'
import Path from './path'
import PreferencePane from './preference-pane'
import RunningApp from './running-app'
import Volume from './volume'

export default {
  extensions: [App, Bookmark, Birthday, BrowserTab, ContactDate, ContactEmail, ContactPhoneNumber, File, Path, PreferencePane, RelationshipDate, RelationshipEmail, RelationshipPhoneNumber, RunningApp, Volume]
}

// export default {
//   extensions: [App, Bookmark, Email, PhoneNumber, File],
//   config: {
//     apps: {type: 'boolean', default: true},
//     contacts: {type: 'boolean', default: true},
//     files: {type: 'boolean', default: true},
//     safariBookmarks: {type: 'boolean', default: true},
//   },
//   translations: [{
//     langs: ['en', 'default'],
//     information: {
//       title: 'Spotlight',
//       description: 'Lacona Extensions allowing you to manipulate data accessible via Spotlight',
//       examples: ['open Safari', 'email Adam', 'open Facebook']
//     }
//   }]
// }
