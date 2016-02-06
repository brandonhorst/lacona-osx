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
    this.query = fetchPreferencePanes()
      .on('data', (data) => {
        this.setData(_.map(data, (item) => new PaneObject(item)))
      }).on('error', (err) => {
        console.error(err)
        this.setData([])
      })
  }

  onDestroy () {
    this.query.cancel()
    delete this.query
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
