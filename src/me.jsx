/** @jsx createElement */

import _ from 'lodash'
import {createElement, Phrase, Source} from 'lacona-phrase'
import {Date as DatePhrase} from 'lacona-phrase-datetime'
import Email from 'lacona-phrase-email'
import PhoneNumber from 'lacona-phrase-phonenumber'
import {dateMap} from './constant-maps'
import { UserContact, spreadObject } from './contact-sources'



// class MyDates extends Source {
//   source () {
//     return {
//       myDates: (
//       )
//     }
//   }
//
//   onCreate () {this.replaceData([])}
//
//   onUpdate () {
//     this.replaceData(this.sources.myDates.data)
//   }
// }

export class PersonalDate extends Phrase {
  source () {
    return {
      myDates:(
        <thru function={_.partial(spreadObject, _, 'dates')}>
          <UserContact />
        </thru>
      )
    }
  }

  describe () {
    const items = _.map(this.sources.myDates.data, ({value, label}) => {
      return {value, text: `my ${dateMap[label] || label}`}
    })

    return (
      <sequence>
        {this.props.prepositions ? <literal text='on ' optional prefered limited /> : null}
        <argument text='special date' showForEmpty>
          <list items={items} />
        </argument>
      </sequence>
    )
  }
}
PersonalDate.extends = [DatePhrase]
