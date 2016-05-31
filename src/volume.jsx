/** @jsx createElement */
import _ from 'lodash'
import {createElement} from 'elliptical'
import {MountedVolume} from 'lacona-phrases'
import {openFile, unmountVolume, fetchMountedVolumes} from 'lacona-api'
import {Observable} from 'rxjs/Observable'
import {mergeMap} from 'rxjs/operator/mergeMap'
import {startWith} from 'rxjs/operator/startWith'

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
    return activate::mergeMap(() => {
      return new Observable((observer) => {
        fetchMountedVolumes((err, volumes) => {
          if (err) {
            console.error(err)
          } else {
            const volumeObjects = _.map(volumes, volume => new VolumeObject(volume))
            observer.next(volumeObjects)
          }
        })
      })
    })::startWith([])
  }
}

  // TODO activate deactivate
  // onActivate () {
  //   global.mountedVolumes((err, volumes) => {
  //     if (volumes) this.replaceData(volumes)
  //   })
  // }
  //
  // onDeactivate () {
  //   this.replaceData([])
  // }

export const Volume = {
  extends: [MountedVolume],

  observe () {
    return <Volumes />
  },

  describe ({data}) {
    const volumes = _.chain(data)
      .map(obj => ({text: obj.name, value: obj}))
      .value()

    return (
      <label text='volume'>
        <list fuzzy items={volumes} />
      </label>
    )
  }
}
