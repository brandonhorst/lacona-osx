/** @jsx createElement */
import _ from 'lodash'
import { PreferencePane } from 'lacona-phrases'
import { createElement } from 'elliptical'
import { watchPreferencePanes, openFile } from 'lacona-api'
import { map } from 'rxjs/operator/map'

class PaneObject {
  constructor ({path, name}) {
    this.path = path
    this.name = name
    this.type = 'preference pane'
    this.limitId = 'preference-pane'
  }

  open () {
    openFile({path: this.path})
  }
}

const Panes = {
  fetch () {
    return watchPreferencePanes()::map((data) => {
      return _.map(data, (item) => new PaneObject(item))
    })
  }
}

export const Pane = {
  extends: [PreferencePane],

  describe ({observe}) {
    const data = observe(<Panes />)
    const panes = _.map(data, pane => ({
      text: pane.name,
      value: pane,
      annotation: {type: 'icon', value: pane.path}
    }))

    return (
      <placeholder argument='preference pane'>
        <list strategy='fuzzy' items={panes} limit={10} score={1} />
      </placeholder>
    )
  }
}
