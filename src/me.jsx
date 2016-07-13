/** @jsx createElement */

import _ from 'lodash'
import { createElement } from 'elliptical'
import { Day, EmailAddress, PhoneNumber } from 'lacona-phrases'
import { dateMap } from './constant-maps'
import { UserContact, spreadObject } from './contact-sources'

function spreadDates (obj) {
  return spreadObject(obj, 'dates')
}

export const PersonalDate = {
  extends: [Day],

  describe ({observe, props}) {
    const data = observe(<UserContact />)
    const dates = spreadDates(data)
    const items = _.map(dates, ({value, label}) => {
      return {value, text: `my ${dateMap[label] || label}`}
    })

    return (
      <sequence>
        {props.prepositions ? <literal text='on ' optional preferred limited category='conjunction' /> : null}
        <placeholder argument='special day' merge>
          <list strategy='fuzzy' items={items} />
        </placeholder>
      </sequence>
    )
  }
}
