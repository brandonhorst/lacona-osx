/** @jsx createElement */
import _ from 'lodash'
import { Application } from 'lacona-phrases'
import { createElement } from 'elliptical'
import { map } from 'rxjs/operator/map'
import { mergeMap } from 'rxjs/operator/mergeMap'
import { fetchApplication, watchApplications, openFile, openURLInApplication, openFileInApplication } from 'lacona-api'
import { subPaths } from './utils'
import { dirname } from 'path'

class AppObject {
  constructor({name, path}) {
    this.name = name
    this.type = 'application'
    this.path = path
  }

  open () {
    openFile({path: this.path}, () => {})
  }

  openURL (url) {
    openURLInApplication({url, applicationPath: this.path})
  }

  openFile (path) {
    openFileInApplication({path, applicationPath: this.path})
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

        return _.map(allNames, name => ({
          bundleId: item.bundleId,
          name,
          path: item.path
        }))
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

  describe({observe, props, config}) {
    const data = observe(<Applications config={config.applications} />)
    const apps = _.map(data, app => ({
      text: app.name,
      value: app,
      annotation: {type: 'icon', path: app.path},
      qualifiers: subPaths(dirname(app.path))
    }))

    return (
      <placeholder argument='application' suppressEmpty={props.suppressEmpty}>
        <list strategy='fuzzy' items={apps} limit={10} />
      </placeholder>
    )
  }
}
