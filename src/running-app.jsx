/** @jsx createElement */
import _ from 'lodash'
import {createElement} from 'elliptical'
import {RunningApplication} from 'lacona-phrases'
import {isDemo, fetchRunningApplications, activateApplication, hideApplication, closeApplicationWindows, quitApplication, launchApplication} from 'lacona-api'
import {Observable} from 'rxjs/Observable'
import {map} from 'rxjs/operator/map'
import {mergeMap} from 'rxjs/operator/mergeMap'
import {startWith} from 'rxjs/operator/startWith'
import {fromPromise} from 'rxjs/observable/fromPromise'

const RunningApps = {
  fetch ({activate}) {
    if (isDemo()) {
      return new Observable((observer) => {
        fetchRunningApplications((err, apps) => {
          const trueData = _.map(apps, app => {
            if (app.activationPolicy === 'regular') {
              return new DockAppObject(app)
            } else {
              return new MenuBarAppObject(app)
            }
          })
          observer.next(trueData)
        })
      })
    } else {
      return activate::mergeMap(() => {
        return fromPromise(fetchRunningApplications())
      })::map((apps) => {
        const trueData = _.map(apps, app => {
          if (app.activationPolicy === 'regular') {
            return new DockAppObject(app)
          } else {
            return new MenuBarAppObject(app)
          }
        })
      })::startWith([])
    }
  }
}

class MenuBarAppObject {
  constructor({bundleId, name}) {
    this.bundleId = bundleId
    this.name = name
    this.type = 'application'
  }

  quit (done) {
    quitApplication({bundleId: this.bundleId}, done)
  }

  launch (done) {
    launchApplication({bundleId: this.bundleId}, done)
  }
}

class DockAppObject {
  constructor({bundleId, name}) {
    this.bundleId = bundleId
    this.name = name
    this.type = 'application'
  }

  activate (done) {
    activateApplication({bundleId: this.bundleId}, done)
  }

  launch (done) {
    launchApplication({bundleId: this.bundleId}, done)
  }

  hide (done) {
    hideApplication({bundleId: this.bundleId}, done)
  }

  close (done) {
    closeApplicationWindows({bundleId: this.bundleId}, done)
  }

  quit (done) {
    quitApplication({bundleId: this.bundleId}, done)
  }
}

export const RunningApp = {
  extends: [RunningApplication],
  observe () {
    return <RunningApps />
  },

  describe ({data, props}) {
    const apps = _.map(data, app => ({text: app.name, value: app}))

    return (
      <label text='application' suppressEmpty={props.suppressEmpty}>
        <list strategy='fuzzy' items={apps} />
      </label>
    )
  }
}
