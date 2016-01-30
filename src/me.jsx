/** @jsx createElement */

import _ from 'lodash'
import { createElement, Phrase, Source } from 'lacona-phrase'
import { Day } from 'lacona-phrase-datetime'
import { EmailAddress } from 'lacona-phrase-email'
import { PhoneNumber } from 'lacona-phrase-phone-number'
import { dateMap } from './constant-maps'
import { UserContact, spreadObject } from './contact-sources'

function spreadDates (obj) {
  return spreadObject(obj, 'dates')
}

export class PersonalDate extends Phrase {
  static extends = [Day]

  observe () {
    return (
      <map function={spreadDates}>
        <UserContact />
      </map>
    )
  }

  describe () {
    const items = _.map(this.source.data, ({value, label}) => {
      return {value, text: `my ${dateMap[label] || label}`}
    })

    return (
      <sequence>
        {this.props.prepositions ? <literal text='on ' optional preferred limited category='conjunction' /> : null}
        <label text='special day' merge>
          <list items={items} />
        </label>
      </sequence>
    )
  }
}
