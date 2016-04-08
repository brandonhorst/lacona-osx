/** @jsx createElement */
import _ from 'lodash'
import { createElement } from 'elliptical'
import { RunningApplication } from 'lacona-phrases'
import { fetchRunningApplications, activateApplication, hideApplication, closeApplicationWindows, quitApplication } from 'lacona-api'
import {Observable} from 'rxjs/Observable'

const RunningApps = {
  fetch () {
    return new Observable((observer) => {
      observer.next([])

      fetchRunningApplications((err, apps) => {
        if (err) {
          console.error(err)
        } else {
          const trueData = _.map(apps, app => new RunningAppObject(app))
          observer.next(trueData)
        }
      })
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

export const RunningApp = {
  extends: [RunningApplication],
  observe () {
    return <RunningApps />
  },

  describe ({data}) {
    const apps = _.map(data, app => ({text: app.name, value: app}))

    return (
      <label text='application'>
        <list fuzzy={true} items={apps} />
      </label>
    )
  }
}
