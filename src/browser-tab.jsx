/** @jsx createElement */

import _ from 'lodash'
import { createElement, Phrase, Source } from 'lacona-phrase'
import { ContentArea } from 'lacona-phrase-system'
import { fetchBrowserTabs, activateBrowserTab, closeBrowserTab } from 'lacona-api'

class TabObject {
  constructor ({appName, tabId, name}) {
    this.appName = appName
    this.id = tabId
    this.name = name
  }

  close() {
    closeBrowserTab({id: this.id})
  }

  activate() {
    activateBrowserTab({id: this.id})
  }
}

class Tabs extends Source {
  data = []

  onCreate () {
    fetchBrowserTabs((err, tabs) => {
      if (err) {
        console.error(err)
      } else {
        const tabObjects = _.map(tabs, tab => new TabObject(tab))
        this.setData(tabObjects)
      }
    })
  }
}

export class BrowserTab extends Phrase {
  static extends = [ ContentArea ]
  observe () {
    return <Tabs />
  }

  describe () {
    const tabs = this.source.data.map(tab => ({text: tab.name, value: tab}))

    return (
      <label text='tab'>
        <list fuzzy items={tabs} limit={10} />
      </label>
    )
  }
}
