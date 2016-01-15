/** @jsx createElement */

import _ from 'lodash'
import { Contacts, possibleNameCombinations, spread } from './contact-sources'
import { createElement, Phrase, Source } from 'lacona-phrase'
import { Day } from 'lacona-phrase-datetime'
import { dateMap } from './constant-maps'
import { EmailAddress } from 'lacona-phrase-email'
import { PhoneNumber } from 'lacona-phrase-phone-number'

function elementsFromContacts (data) {
  const elements = _.chain(data)
    .map(({firstName, middleName, lastName, nickname, company, value, label}) => {
      const possibleNames = possibleNameCombinations({firstName, middleName, lastName, nickname, company})
      const items = _.map(possibleNames, text => ({text, value}))

      return <list items={items} limit={1} />
    })
    .value()

  return (
    <label text='contact'>
      <choice limit={10}>
        {elements}
      </choice>
    </label>
  )
}

class ContactPhrase extends Phrase {
  describe () {
    return elementsFromContacts(this.source.data)
  }
}

function spreadEmails (ary) {
  return spread(ary, 'emails', ['firstName', 'lastName', 'middleName', 'nickname', 'company'])
}

export class ContactEmail extends ContactPhrase {
  static extends = [EmailAddress]
  observe () {
    return (
      <map function={spreadEmails}>
        <Contacts />
      </map>
    )
  }
}

function spreadPhoneNumbers (ary) {
  return spread(ary, 'phoneNumbers', ['firstName', 'lastName', 'middleName', 'nickname', 'company'])
}

export class ContactPhoneNumber extends ContactPhrase {
  static extends = [PhoneNumber]
  observe () {
    return (
      <map function={spreadPhoneNumbers}>
        <Contacts />
      </map>
    )
  }
}

function spreadDates (ary) {
  return spread(ary, 'dates', ['firstName', 'lastName', 'middleName', 'nickname', 'company'])
}

export class ContactDate extends Phrase {
  static extends = [Day]

  observe () {
    return (
      <map function={spreadDates}>
        <Contacts />
      </map>
    )
  }

  describe () {
    const items = _.chain(this.source.data)
      .map(({firstName, middleName, lastName, nickname, company, value, label}) => {
        const dateNames = dateMap[label] || [label]
        const possibleNames = possibleNameCombinations({firstName, middleName, lastName, nickname})
        return (
          <choice limit={1} value={value}>
            {_.map(dateNames, dateName => {
              return _.map(possibleNames, possibleName => (
                <sequence>
                  <label text='contact'>
                    <literal text={`${possibleName}'s `} />
                  </label>
                  <label text='special date'>
                    <literal text={dateName} />
                  </label>
                </sequence>
              ))
            })}
          </choice>
        )
      })
      .value()

    return (
      <sequence>
        {this.props.prepositions ? <literal text='on ' category='conjunction' optional limited preferred /> : null}
        <choice limit={10}>
          {items}
        </choice>
      </sequence>
    )
  }
}
