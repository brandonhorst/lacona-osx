/** @jsx createElement */
import _ from 'lodash'
import { createElement } from 'elliptical'
import { MountedVolume } from 'lacona-phrases'
import { openFile, unmountVolume, fetchMountedVolumes } from 'lacona-api'
import {Observable} from 'rxjs/Observable'

class VolumeObject {
  constructor ({name, path, canOpen, canEject}) {
    this.name = name
    this.path = path
    this.canOpen = canOpen
    this.canEject = canEject
    this.type = 'volume'
  }

  canOpen () {
    return this.canOpen
  }

  open () {
    openFile({path: this.path})
  }

  canEject () {
    return this.canEject
  }

  eject () {
    unmountVolume({id: this.name})
  }
}

const Volumes = {
  fetch () {
    return new Observable((observer) => {
      observer.next([])

      fetchMountedVolumes((err, volumes) => {
        if (err) {
          observer.next([])
          console.error(err)
        } else {
          const volumeObjects = _.map(volumes, volume => new VolumeObject(volume))
          observer.next(volumeObjects)
        }
      })
    })
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
