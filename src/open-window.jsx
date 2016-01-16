/** @jsx createElement */

import _ from 'lodash'
import { createElement, Phrase, Source } from 'lacona-phrase'
import { ContentArea } from 'lacona-phrase-system'
import { fetchOpenWindows, activateOpenWindow, closeOpenWindow } from 'lacona-api'

class WindowObject {
  constructor ({id, name, closeable}) {
		this.id = id
    this.name = name
    this.closeable = closeable
  }

  activate () {
		activateOpenWindow({id: this.id})
  }

	canClose () {
		return this.closeable
	}

  close () {
		closeOpenWindow({id: this.id})
  }
}

class Windows extends Source {
	data = []

  onCreate () {
    this.onActivate()
  }

	onActivate () {
		fetchOpenWindows((err, windows) => {
			if (err) {
				console.error(err)
			} else {
				const windowObjects = _.map(windows, window => new WindowObject(window))
				this.setData(windowObjects)
      }
		})
  }
}

export class OpenWindow extends Phrase {
  static extends = [ContentArea]
  
  observe () {
		return <Windows />
  }

  describe () {
    const windows = _.map(this.source.data, win => ({text: win.name, value: win}))

    return (
      <label text='window'>
        <list fuzzy={true} items={windows} />
      </label>
    )
  }
}
