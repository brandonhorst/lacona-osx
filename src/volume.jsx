/** @jsx createElement */
import _ from 'lodash'
import { createElement, Phrase, Source } from 'lacona-phrase'
import { MountedVolume } from 'lacona-phrase-system'
import { openFile, unmountVolume, fetchMountedVolumes } from 'lacona-api'

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

class Volumes extends Source {
  data = []

  onCreate() {
    this.onActivate()
  }

  onActivate () {
    fetchMountedVolumes((err, volumes) => {
      if (err) {
        console.error(err)
      } else {
        const volumeObjects = _.map(volumes, volume => new VolumeObject(volume))
        this.setData(volumeObjects)
      }
    })
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
}

export class Volume extends Phrase {
  static extends = [MountedVolume]

  observe () {
    return <Volumes />
  }

  describe () {
    const volumes = _.chain(this.source.data)
      .map(obj => ({text: obj.name, value: obj}))
      .value()

    return (
      <label text='volume'>
        <list fuzzy items={volumes} />
      </label>
    )
  }
}
