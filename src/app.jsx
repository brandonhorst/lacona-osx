/** @jsx createElement */
import _ from 'lodash'
import { Application } from 'lacona-phrase-system'
import { createElement, Phrase, Source } from 'lacona-phrase'
import { fetchApplications, launchApplication, openURLInApplication, openFileInApplication } from 'lacona-api'

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

  onCreate () {
    this.query = fetchApplications()
      .on('data', (data) => {
        this.setData(_.map(data, (item) => new AppObject(item)))
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
        <list fuzzy items={apps} limit={10} />
      </label>
    )
  }
}
