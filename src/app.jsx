/** @jsx createElement */
import _ from 'lodash'
import { Application } from 'lacona-phrases'
import { createElement } from 'elliptical'
import { map } from 'rxjs/operator/map'
import { mergeMap } from 'rxjs/operator/mergeMap'
import { fetchApplication, watchApplications, launchApplication, openURLInApplication, openFileInApplication } from 'lacona-api'

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

async function getSpecificApps (applications) {
  const infoPromises = _.map(applications, name => fetchApplication({name}))
  const info = await Promise.all(infoPromises)
  return _.filter(info)
}

const Applications = {
  fetch ({props}) {
    return watchApplications({
      directories: props.config.searchDirectories
    })::map(data => {
      // Add in the alternativeNames, but remove .app and case-insensitive uniquify
      const newData = _.flatMap(data, item => {
        const allNames = _.chain([item.name])
        .concat(item.alternativeNames || [])
        .map(name => _.endsWith(_.toLower(name), '.app') ? name.slice(0, -4) : name)
        .uniqBy(_.toLower)
        .value()

        return _.map(allNames, name => ({bundleId: item.bundleId, name}))
      })

      return newData
    })::mergeMap(async data => {
      const specificApps = await getSpecificApps(props.config.applications)
      return data.concat(specificApps)
    })::map((data) => {
      return _.map(data, (item) => new AppObject(item))
    })
  }
}

export const App = {
  extends: [Application],

  observe ({config}) {
    return <Applications config={config.applications} />
  },

  describe({data, props}) {
    const apps = _.map(data, app => ({
      text: app.name,
      value: app
    }))

    return (
      <label text='application' suppressEmpty={props.suppressEmpty}>
        <list strategy='fuzzy' items={apps} limit={10} />
      </label>
    )
  }
}
