/** @jsx createElement */
import Application from 'lacona-phrase-application'
import {createElement, Phrase} from 'lacona-phrase'
import Spotlight from './spotlight'

// function close(bundleId) {
//   global.closeAllWindowsInApp(bundleId, () => {})
// }
//
// function open(bundleId) {
//   global.launchApp(bundleId, () => {})
// }
//
// function quit(bundleId) {
//   global.quitApp(bundleId, () => {})
// }
//
// function hide(bundleId) {
//   global.hideApp(bundleId, () => {})
// }

export default class App extends Phrase {
  source() {
    return {apps: <Spotlight directories={['/Applications']} query="kMDItemContentTypeTree == 'com.apple.application'" attributes={['kMDItemDisplayName', 'kMDItemCFBundleIdentifier', 'kMDItemPath']}/>}
  }

  describe() {
    const apps = this.sources.apps.data.map(app => ({
      text: app.kMDItemDisplayName,
      value: app.kMDItemCFBundleIdentifier
    }))
    //     open: open.bind(null, app.kMDItemCFBundleIdentifier),
    //     hide: hide.bind(null, app.kMDItemCFBundleIdentifier),
    //     close: close.bind(null, app.kMDItemCFBundleIdentifier),
    //     quit: quit.bind(null, app.kMDItemCFBundleIdentifier),
    //   }
    // }))

    return (
      <argument text='application'>
        <list fuzzy={true} items={apps} limit={10} />
      </argument>
    )
  }
}
App.extends = [Application]
