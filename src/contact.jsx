/** @jsx createElement */

import _ from 'lodash'
import {createElement, Phrase, Source} from 'lacona-phrase'
import BaseEmail from 'lacona-phrase-email'
import BasePhoneNumber from 'lacona-phrase-phonenumber'

class Emails extends Source {
  onCreate () {
    this.replaceData([])
    global.allEmails((err, emails) => {
      this.replaceData(emails)
    })
  }
}

class PhoneNumbers extends Source {
  onCreate () {
    this.replaceData([])
    global.allPhoneNumbers((err, numbers) => {
      this.replaceData(numbers)
    })
  }
}

export class Email extends Phrase {
  describe () {
    const contacts = _.chain(this.sources.emails.data) // TODO this is WET
      .map(({firstName, lastName, middleName, nickname, email}) => {
        return {
          text: `${firstName} ${lastName}`,
          value: email
        }
      })
      .value()

    return (
      <argument text='contact' showForEmpty={true}>
        <list items={contacts} limit={10} fuzzy={true} />
      </argument>
    )
  }

  source () {
    return {
      emails: <Emails />
    }
  }
}
Email.extends = [BaseEmail]

export class PhoneNumber extends Phrase {
  describe () {
    const contacts = _.chain(this.sources.phoneNumbers.data)
      .map(({firstName, lastName, middleName, nickname, email}) => {
        return {
          text: `${firstName} ${lastName}`,
          value: email
        }
      })
      .value()

    return (
      <argument text='contact' showForEmpty={true}>
        <list items={contacts} limit={10} fuzzy={true} />
      </argument>
    )
  }

  source () {
    return {
      phoneNumbers: <PhoneNumbers />
    }
  }
}
PhoneNumber.extends = [BasePhoneNumber]
