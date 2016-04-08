/** @jsx createElement */
import _ from 'lodash'
import { Application } from 'lacona-phrases'
import { createElement } from 'elliptical'
import { map } from 'rxjs/operator/map'
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

function getSpecificApps (applications) {
  return _.chain(applications)
    .map(name => ({bundleId: bundleIdForApplication({name}), name}))
    .filter(item => item.bundleId != null)
    .value()
}

const Applications = {
  fetch ({props}) {
    return fetchApplications({
      directories: props.config.searchDirectories
    })::map((data) => {
      return data.concat(getSpecificApps(props.config.applications))
    })::map((data) => {
      return _.map(data, (item) => new AppObject(item))
    })
  }
}

export const App = {
  extends: [Application],

  observe ({context}) {
    return <Applications config={context.config.applications} />
  },

  describe({data}) {
    const apps = _.map(data, app => ({
      text: app.name,
      value: app
    }))

    return (
      <label text='application'>
        <list strategy='fuzzy' items={apps} limit={10} />
      </label>
    )
  }
}
