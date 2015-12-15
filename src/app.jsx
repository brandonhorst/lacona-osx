/** @jsx createElement */
import Application from 'lacona-phrase-application'
import {createElement, Phrase, Source} from 'lacona-phrase'
import Spotlight from './spotlight'

class AppObject {
  constructor({kMDItemCFBundleIdentifier, kMDItemDisplayName, kMDItemPath}) {
    this.bundleId = kMDItemCFBundleIdentifier
    this.name = kMDItemDisplayName
  }

  open () {
    global.launchApplication(this.bundleId, () => {})
  }

  openURL (url) {
    global.openURLInApplication(rl, this.bundleId)
  }

  openFile (file) {
    global.openURLInApplication(file, this.bundleId)
  }
}

function toObject (obj) {
  return new AppObject(obj)
}

class DemoApps extends Source {
  onCreate () {
    this.replaceData(global.config.apps)
  }
}

export default class App extends Phrase {
  source() {
    if (process.env.LACONA_ENV === 'demo') {
      return {
        apps: <DemoApps />
      }
    } else {
      return {
        apps: (
          <map function={toObject}>
            <Spotlight directories={['/Applications']} query="kMDItemContentTypeTree == 'com.apple.application'" attributes={['kMDItemDisplayName', 'kMDItemCFBundleIdentifier', 'kMDItemPath']}/>
          </map>
        )
      }
    }
  }

  describe() {
    const apps = this.sources.apps.data.map(app => ({
      text: app.name,
      value: app
    }))

    return (
      <argument text='application'>
        <list fuzzy={true} items={apps} limit={10} />
      </argument>
    )
  }
}
App.extends = [Application]
