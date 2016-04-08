/** @jsx createElement */
import _ from 'lodash'
import { PreferencePane } from 'lacona-phrases'
import { createElement } from 'elliptical'
import { fetchPreferencePanes, openFile } from 'lacona-api'
import { map } from 'rxjs/operator/map'

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

const Panes = {
  fetch () {
    return fetchPreferencePanes()::map((data) => {
      return _.map(data, (item) => new PaneObject(item))
    })
  }
}

export const Pane = {
  extends: [PreferencePane],

  observe () {
    return <Panes />
  },

  describe ({data}) {
    const panes = _.map(data, pane => ({text: pane.name, value: pane}))

    return (
      <label text='preference pane'>
        <list fuzzy items={panes} limit={10} score={1} />
      </label>
    )
  }
}
