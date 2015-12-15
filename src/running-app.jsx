/** @jsx createElement */
import {createElement, Phrase, Source} from 'lacona-phrase'
import {RunningApplication} from 'lacona-phrase-system-state'

class DemoRunningApps extends Source {
  onCreate () {
    this.replaceData(global.config.apps)
  }
}

class RunningApps extends Source {
  onCreate () {
    this.replaceData([])
  }

  onActivate () {
    global.allRunningApps((err, apps) => {
      if (apps) this.replaceData(apps)
    })
  }

  onDeactivate () {
    this.replaceData([])
  }
}

class RunningAppObject {
  constructor(item) {
    this.bundleId = item.id
    this.name = item.name
  }


  activate () {
    global.launchApplication(this.bundleId, () => {})
  }

  hide () {
    global.hideApplication(this.bundleId, () => {})
  }

  close () {
    const script = `
      tell application "System Events"
      	set proc to first process whose background only is false and bundle identifier is "${this.bundleId}"
      	repeat with win in proc's windows
      		set butt to (win's first button whose subrole is "AXCloseButton")
      		click butt
      	end repeat
      end tell
    `
    global.applescript(script)
  }

  quit () {
    global.quitApplication(this.bundleId, () => {})
  }
}

function toObject (obj) {
  return new RunningAppObject(obj)
}

export default class RunningApp extends Phrase {
  source () {
    if (process.env.LACONA_ENV === 'demo') {
      return {apps: <DemoRunningApps />}
    } else {
      return {
        apps: (
          <map function={toObject}>
            <RunningApps />
          </map>
        )
      }
    }
  }

  describe () {
    const apps = this.sources.apps.data.map(app => ({text: app.name, value: app}))

    return (
      <argument text='application'>
        <list fuzzy={true} items={apps} />
      </argument>
    )
  }
}
RunningApp.extends = [RunningApplication]
