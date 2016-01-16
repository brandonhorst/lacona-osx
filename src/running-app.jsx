/** @jsx createElement */
import _ from 'lodash'
import { createElement, Phrase, Source } from 'lacona-phrase'
import { RunningApplication } from 'lacona-phrase-system'
import { fetchRunningApplications, activateApplication, hideApplication, closeApplicationWindows, quitApplication } from 'lacona-api'

class RunningApps extends Source {
  data = []

  onCreate () {
    this.onActivate()
  }

  onActivate () {
    fetchRunningApplications((err, apps) => {
      if (err) {
        console.error(err)
      } else {
        const trueData = _.map(apps, app => new RunningAppObject(app))
        this.setData(trueData)
      }
    })
  }
}

class RunningAppObject {
  constructor(item) {
    this.bundleId = item.bundleId
    this.name = item.name
    this.type = 'application'
  }


  activate () {
    activateApplication({bundleId: this.bundleId})
  }

  hide () {
    hideApplication({bundleId: this.bundleId})
  }

  close () {
    closeApplicationWindows({bundleId: this.bundleId})
  }

  quit () {
    quitApplication({bundleId: this.bundleId})
  }
}

export class RunningApp extends Phrase {
  observe () {
    return <RunningApps />
  }

  describe () {
    const apps = _.map(this.source.data, app => ({text: app.name, value: app}))

    return (
      <label text='application'>
        <list fuzzy={true} items={apps} />
      </label>
    )
  }
}
RunningApp.extends = [RunningApplication]
