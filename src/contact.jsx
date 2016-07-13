/** @jsx createElement */

import _ from 'lodash'
import { Contacts, possibleNameCombinations, spread } from './contact-sources'
import { createElement } from 'elliptical'
import { Day, EmailAddress, PhoneNumber, ContactCard } from 'lacona-phrases'
import { dateMap } from './constant-maps'
import { openURL } from 'lacona-api'
import * as constantMaps from './constant-maps'

function spreadElementsFromContacts (data, map) {
  const elements = _.map(data, ({firstName, middleName, lastName, nickname, company, value, label, id}) => {
    const possibleNames = possibleNameCombinations({firstName, middleName, lastName, nickname, company})
    const qualifiers = [map[label] ? map[label][0] : label]
    const items = _.map(possibleNames, text => ({
      text,
      value,
      qualifiers,
      annotation: {type: 'contact', id}
    }))

    return <list strategy='fuzzy' items={items} limit={1} />
  })

  return (
    <placeholder argument='contact'>
      <choice limit={10}>
        {elements}
      </choice>
    </placeholder>
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
    const items = _.map(possibleNames, text => ({
      text,
      value,
      annotation: {type: 'contact', id}
    }))

    return <list strategy='fuzzy' items={items} limit={1} />
  })

  return (
    <placeholder argument='contact'>
      <choice limit={10}>
        {elements}
      </choice>
    </placeholder>
  )
}

function spreadEmails (ary) {
  return spread(ary, 'emails', ['firstName', 'lastName', 'middleName', 'nickname', 'company', 'id'])
}

function spreadPhoneNumbers (ary) {
  return spread(ary, 'phoneNumbers', ['firstName', 'lastName', 'middleName', 'nickname', 'company', 'id'])
}

function spreadDates (ary) {
  return spread(ary, 'dates', ['firstName', 'lastName', 'middleName', 'nickname', 'company', 'id'])
}

export const Contact = {
  extends: [ContactCard],

  describe ({observe}) {
    const data = observe(<Contacts />)
    return contactElementsFromContacts(data)
  }
}

export const ContactEmail = {
  extends: [EmailAddress],
  
  describe ({observe}) {
    const data = observe(<Contacts />)
    const emails = spreadEmails(data)
    return spreadElementsFromContacts(emails, constantMaps.emailLabelMap)
  }
}

export const ContactPhoneNumber = {
  extends: [PhoneNumber],
  
  describe ({observe}) {
    const data = observe(<Contacts />)
    const phoneNumbers = spreadPhoneNumbers(data)
    return spreadElementsFromContacts(phoneNumbers, constantMaps.phoneNumberMap)
  }
}

export const ContactDate = {
  extends: [Day],

  describe ({observe, props}) {
    const data = observe(<Contacts />)
    const dates = spreadDates(data)
    const items = _.chain(dates)
      .map(({firstName, middleName, lastName, nickname, company, value, label, id}) => {
        const dateNames = dateMap[label] || [label]
        const possibleNames = possibleNameCombinations({firstName, middleName, lastName, nickname})
        return (
          <choice limit={1} value={value}>
            {_.map(dateNames, dateName => {
              return _.map(possibleNames, possibleName => (
                <sequence>
                  <placeholder argument='contact'>
                    <literal
                      strategy='fuzzy'
                      text={`${possibleName}'s`}
                      annotation={{type: 'contact', id}} />
                  </placeholder>
                  <literal text=' ' />
                  <placeholder argument='special day' suppressEmpty={false}>
                    <literal strategy='fuzzy' text={dateName} />
                  </placeholder>
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
        <placeholder argument='special day' merge>
          <choice limit={10}>
            {items}
          </choice>
        </placeholder>
      </sequence>
    )
  }
}
