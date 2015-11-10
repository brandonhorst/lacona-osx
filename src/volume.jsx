/** @jsx createElement */
import {createElement, Phrase, Source} from 'lacona-phrase'
import Applescript from './applescript'
import {MountedVolume} from 'lacona-phrase-system-state'

class Volumes extends Source {
  onCreate () {
    this.replaceData([])
  }

  onActivate () {
    global.mountedVolumes((err, volumes) => {
      if (volumes) this.replaceData(volumes)
    })
  }

  onDeactivate () {
    this.replaceData([])
  }
}

export default class Volume extends Phrase {
  source () {
    return {volumes: <Volumes />}
  }

  describe () {
    const volumes = this.sources.volumes.data.map(volume => ({text: volume.name, value: volume.name}))

    return (
      <argument text='volume'>
        <list fuzzy={true} items={volumes} />
      </argument>
    )
  }
}
Volume.extends = [MountedVolume]
