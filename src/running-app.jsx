/** @jsx createElement */
import _ from 'lodash'
import {createElement} from 'elliptical'
import {RunningApplication} from 'lacona-phrases'
import {fetchRunningApplications, activateApplication, hideApplication, closeApplicationWindows, quitApplication} from 'lacona-api'
import {Observable} from 'rxjs/Observable'
import {mergeMap} from 'rxjs/operator/mergeMap'
import {startWith} from 'rxjs/operator/startWith'

const RunningApps = {
  fetch ({activate}) {
    return activate::mergeMap(() => {
      return new Observable((observer) => {
        fetchRunningApplications((err, apps) => {
          if (err) {
            console.error(err)
          } else {
            const trueData = _.map(apps, app => {
              if (app.activationPolicy === 'regular') {
                return new DockAppObject(app)
              } else {
                return new MenuBarAppObject(app)
              }
            })
            observer.next(trueData)
          }
        })
      })
    })::startWith([])
  }
}

class MenuBarAppObject {
  constructor({bundleId, name}) {
    this.bundleId = bundleId
    this.name = name
    this.type = 'application'
  }

  quit () {
    quitApplication({bundleId: this.bundleId})
  }
}

class DockAppObject {
  constructor({bundleId, name}) {
    this.bundleId = bundleId
    this.name = name
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
