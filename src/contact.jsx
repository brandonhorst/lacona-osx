/** @jsx createElement */

import _ from 'lodash'
import { Contacts, possibleNameCombinations, spread } from './contact-sources'
import { createElement } from 'elliptical'
import { Day, EmailAddress, PhoneNumber, ContactCard } from 'lacona-phrases'
import { dateMap } from './constant-maps'
import { openURL } from 'lacona-api'
import * as constantMaps from './constant-maps'

function spreadElementsFromContacts (data, map) {
  const elements = _.map(data, ({firstName, middleName, lastName, nickname, company, value, label}) => {
    const possibleNames = possibleNameCombinations({firstName, middleName, lastName, nickname, company})
    const qualifiers = [map[label] ? map[label][0] : label]
    const items = _.map(possibleNames, text => ({text, value, qualifiers}))

    return <list items={items} limit={1} />
  })

  return (
    <label text='contact'>
      <choice limit={10}>
        {elements}
      </choice>
    </label>
  )
}

class ContactObject {
  constructor ({id, name}) {
    this.id = id
    this.name = name
    this.type = 'contact card'
    this.limitId = 'contact-card'
  }

  open () {
    openURL({url: `addressbook://${this.id}`})
  }
}

function contactElementsFromContacts (data) {
  const elements = _.map(data, ({firstName, middleName, lastName, nickname, company, id}) => {
    const possibleNames = possibleNameCombinations({firstName, middleName, lastName, nickname, company})
    const value = new ContactObject({id, name: possibleNames[0]})
    const items = _.map(possibleNames, text => ({text, value}))

    return <list items={items} limit={1} />
  })

  return (
    <label text='contact'>
      <choice limit={10}>
        {elements}
      </choice>
    </label>
  )
}

function spreadEmails (ary) {
  return spread(ary, 'emails', ['firstName', 'lastName', 'middleName', 'nickname', 'company'])
}

function spreadPhoneNumbers (ary) {
  return spread(ary, 'phoneNumbers', ['firstName', 'lastName', 'middleName', 'nickname', 'company'])
}

function spreadDates (ary) {
  return spread(ary, 'dates', ['firstName', 'lastName', 'middleName', 'nickname', 'company'])
}

export const Contact = {
  extends: [ContactCard],
  observe () {
    return <Contacts />
  },

  describe ({data}) {
    return contactElementsFromContacts(data)
  }
}

export const ContactEmail = {
  extends: [EmailAddress],
  observe () {
    return <Contacts />
  },

  describe ({data}) {
    const emails = spreadEmails(data)
    return spreadElementsFromContacts(emails, constantMaps.emailLabelMap)
  }
}

export const ContactPhoneNumber = {
  extends: [PhoneNumber],

  observe () {
    return <Contacts />
  },
  
  describe ({data}) {
    const phoneNumbers = spreadPhoneNumbers(data)
    return spreadElementsFromContacts(phoneNumbers, constantMaps.phoneNumberMap)
  }
}

export const ContactDate = {
  extends: [Day],

  observe () {
    return <Contacts />
  },

  describe ({data, props}) {
    const dates = spreadDates(data)
    const items = _.chain(dates)
      .map(({firstName, middleName, lastName, nickname, company, value, label}) => {
        const dateNames = dateMap[label] || [label]
        const possibleNames = possibleNameCombinations({firstName, middleName, lastName, nickname})
        return (
          <choice limit={1} value={value}>
            {_.map(dateNames, dateName => {
              return _.map(possibleNames, possibleName => (
                <sequence>
                  <label text='contact'>
                    <literal text={`${possibleName}'s`} />
                  </label>
                  <literal text=' ' />
                  <label text='special day' suppressEmpty={false}>
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
        {props.prepositions ? <literal text='on ' category='conjunction' optional limited preferred /> : null}
        <label text='special day' merge>
          <choice limit={10}>
            {items}
          </choice>
        </label>
      </sequence>
    )
  }
}
