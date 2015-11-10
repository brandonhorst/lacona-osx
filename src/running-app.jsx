/** @jsx createElement */
import {createElement, Phrase, Source} from 'lacona-phrase'
import Applescript from './applescript'
import {RunningApplication} from 'lacona-phrase-system-state'

// const script = `
//   tell application "System Events"
//     set allApps to {}
//     repeat with proc in (every process where background only is false)
//       set end of allApps to proc's {name, id}
//     end repeat
//   end tell
//   return allApps
// `

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

export default class RunningApp extends Phrase {
  source () {
    // return {apps: <Applescript script='fetchRunningApps' keys={['name', 'id']} />}
    // return {apps: <Applescript code={script} keys={['name', 'id']} />}
    return {apps: <RunningApps />}
  }

  describe () {
    const apps = this.sources.apps.data.map(app => ({text: app.name, value: app.id}))

    return (
      <argument text='application'>
        <list fuzzy={true} items={apps} />
      </argument>
    )
  }
}
RunningApp.extends = [RunningApplication]
