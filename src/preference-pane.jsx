/** @jsx createElement */
import _ from 'lodash'
import { PreferencePane } from 'lacona-phrase-system'
import { createElement, Phrase, Source } from 'lacona-phrase'
import { fetchPreferencePanes, openFile } from 'lacona-api'

class PaneObject {
  constructor ({path, name}) {
    this.path = path
    this.name = name
    this.type = 'preference pane'
  }

  open () {
    openFile({path: this.path})
  }
}

class Panes extends Source {
  data = []

  onCreate () {
    this.onActivate()
  }

  onActivate () {
    fetchPreferencePanes((err, panes) => {
      if (err) {
        console.error(err)
      } else {
        const trueData = _.map(panes, pane => new PaneObject(pane))
        this.setData(trueData)
      }
    })
  }
}

export class Pane extends Phrase {
  static extends = [PreferencePane]

  observe () {
    return <Panes />
  }

  describe () {
    const panes = _.map(this.source.data, pane => ({text: pane.name, value: pane}))

    return (
      <label text='preference pane'>
        <list fuzzy items={panes} limit={10} />
      </label>
    )
  }
}
