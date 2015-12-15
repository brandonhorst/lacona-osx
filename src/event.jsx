/** @jsx createElement */

import _ from 'lodash'
import { createElement, Phrase, Source } from 'lacona-phrase'
import { Date as DatePhrase } from 'lacona-phrase-datetime'

class HolidaySource extends Source {
  onCreate () {
    if (process.env.LACONA_ENV === 'demo') {
      this.replaceData(global.config.usHolidays)
    } else {
      this.replaceData([])
    }
  }
}

export class Holiday extends Phrase {
  source () {
    return {dates: <HolidaySource />}
  }

  describe () {
    if (this.sources.dates.data.length === 0) return

    return (
      <argument text='holiday'>
        <list items={this.sources.dates.data} />
      </argument>
    )
  }
}

Holiday.extends = [DatePhrase]
