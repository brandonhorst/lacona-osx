/** @jsx createElement */
import _ from 'lodash'
import {createElement} from 'elliptical'
import {MountedVolume} from 'lacona-phrases'
import {isDemo, openFile, unmountVolume, fetchMountedVolumes} from 'lacona-api'
import {Observable} from 'rxjs/Observable'
import {map} from 'rxjs/operator/map'
import {mergeMap} from 'rxjs/operator/mergeMap'
import {startWith} from 'rxjs/operator/startWith'
import {fromPromise} from 'rxjs/observable/fromPromise'

class VolumeObject {
  constructor ({name, path, canOpen, canEject}) {
    this.name = name
    this.path = path
    this.type = 'volume'
    if (canOpen) {
      this.open = () => openFile({path})
    }

    if (canEject) {
      this.eject = () => unmountVolume({id: name})
    }
  }
}

const Volumes = {
  fetch ({activate}) {
    if (isDemo()) {
      return new Observable((observer) => {
        fetchMountedVolumes((err, volumes) => {
          const volumeObjects = _.map(volumes, volume => new VolumeObject(volume))
          observer.next(volumeObjects)
        })
      })
    } else {
      return activate::mergeMap(() => {
        return fromPromise(fetchMountedVolumes())
      })::map((volumes) => {
        return _.map(volumes, volume => new VolumeObject(volume))
      })::startWith([])
    }
  }
}

export const Volume = {
  extends: [MountedVolume],

  describe ({observe, props}) {
    const data = observe(<Volumes />)
    const volumes = _.chain(data)
      .map(obj => ({text: obj.name, value: obj}))
      .value()

    return (
      <placeholder argument='volume' suppressEmpty={props.suppressEmpty}>
        <list strategy='fuzzy' items={volumes} />
      </placeholder>
    )
  }
}
