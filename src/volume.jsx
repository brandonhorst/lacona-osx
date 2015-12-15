/** @jsx createElement */
import _ from 'lodash'
import {createElement, Phrase, Source} from 'lacona-phrase'
import Applescript from './applescript'
import {MountedVolume} from 'lacona-phrase-system-state'


class Volumes extends Source {
  onCreate () {
    if (process.env.LACONA_ENV === 'demo') {
      this.replaceData(global.config.volumes)
    } else {
      this.replaceData([])
    }
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
    const volumes = _.chain(this.sources.volumes.data)
      .filter('ejectable')
      .map(({name}) => ({text: name, value: name}))
      .value()

    return (
      <argument text='volume'>
        <list fuzzy={true} items={volumes} />
      </argument>
    )
  }
}
Volume.extends = [MountedVolume]
