/** @jsx createElement */
import _ from 'lodash'
import { Application } from 'lacona-phrase-system'
import { createElement, Phrase, Source } from 'lacona-phrase'
import { bundleIdForApplication, fetchApplications, launchApplication, openURLInApplication, openFileInApplication, Config } from 'lacona-api'

class AppObject {
  constructor({bundleId, name}) {
    this.bundleId = bundleId
    this.name = name
    this.type = 'application'
  }

  open () {
    launchApplication({bundleId: this.bundleId}, () => {})
  }

  openURL (url) {
    openURLInApplication({url, bundleId: this.bundleId})
  }

  openFile (path) {
    openFileInApplication({path, bundleId: this.bundleId})
  }
}

class Applications extends Source {
  data = []

  observe () {
    return <Config property='applications' />
  }

  onCreate() {
    this.onUpdate()
  }

  onUpdate () {
    const specificApps = _.chain(this.source.data.applications)
      .map(name => ({bundleId: bundleIdForApplication({name}), name}))
      .filter(item => item.bundleId == null)
      .map(name => new AppObject(item))
      .value()

    this.query = fetchApplications({
      directories: this.source.data.directories
    }).on('data', (data) => {
      const searchDirs = _.map(data, (item) => new AppObject(item))

      this.setData(searchDirs.concat(specificApps))
    }).on('error', (err) => {
      console.error(err)
      this.setData([])
    })
  }

  onDestroy () {
    this.query.cancel()
    delete this.query
  }
}

export class App extends Phrase {
  static extends = [Application]

  observe () {
    return <Applications />
  }

  describe() {
    const apps = _.map(this.source.data, app => ({
      text: app.name,
      value: app
    }))

    return (
      <label text='application'>
        <list fuzzy items={apps} limit={10} score={1} />
      </label>
    )
  }
}
