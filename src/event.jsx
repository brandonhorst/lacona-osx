/** @jsx createElement */

import _ from 'lodash'
import { createElement, Phrase, Source } from 'lacona-phrase'
import { Date as DatePhrase } from 'lacona-phrase-datetime'
import { isDemo } from 'lacona-api'

class HolidaySource extends Source {
  data = []

  onCreate () {
    if (isDemo()) {
      this.setData(global.demoData.usHolidays)
    }
  }
}

export class Holiday extends Phrase {
  static extends = [DatePhrase]
  
  observe () {
    return <HolidaySource />
  }

  describe () {
    if (this.source.data.length === 0) return

    return (
      <label text='holiday'>
        <list items={this.source.data} limit={10} />
      </label>
    )
  }
}
