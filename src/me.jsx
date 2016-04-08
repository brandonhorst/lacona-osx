/** @jsx createElement */

import _ from 'lodash'
import { createElement } from 'elliptical'
import { Day } from 'elliptical-datetime'
import { EmailAddress } from 'elliptical-email'
import { PhoneNumber } from 'elliptical-phone'
import { dateMap } from './constant-maps'
import { UserContact, spreadObject } from './contact-sources'

function spreadDates (obj) {
  return spreadObject(obj, 'dates')
}

export const PersonalDate = {
  extends: [Day],

  observe () {
    return <UserContact />
  },

  describe ({data, props}) {
    const dates = spreadDates(data)
    const items = _.map(dates, ({value, label}) => {
      return {value, text: `my ${dateMap[label] || label}`}
    })

    return (
      <sequence>
        {props.prepositions ? <literal text='on ' optional preferred limited category='conjunction' /> : null}
        <label text='special day' merge>
          <list items={items} />
        </label>
      </sequence>
    )
  }
}
