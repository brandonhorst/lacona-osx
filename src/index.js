
// export {Applescript} from './applescript'
// export {default as Spotlight} from './spotlight'

import { App } from './app'
import { Bookmark } from './bookmark'
// import { BrowserTab } from './browser-tab'
import { ContactDate, ContactEmail, ContactPhoneNumber } from './contact'
import { RelationshipDate, RelationshipPhoneNumber, RelationshipEmail } from './relationship'
import { PersonalDate } from './me'
import { Holiday } from './event'
import { File } from './file'
// import { OpenWindow } from './open-window'
import { Path } from './path'
import { Pane } from './preference-pane'
import { RunningApp } from './running-app'
import { SystemCommand } from './command'
import { Volume } from './volume'

export const extensions = [App, Bookmark, /*BrowserTab,*/ ContactDate, ContactEmail, ContactPhoneNumber, File, /* Holiday, OpenWindow,*/ Path, PersonalDate, Pane, RelationshipDate, RelationshipEmail, RelationshipPhoneNumber, RunningApp, SystemCommand, Volume]

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
