/** @jsx createElement */

import _ from 'lodash'
import { Contacts, possibleNameCombinations, spread } from './contact-sources'
import { createElement, unique } from 'elliptical'
import { Day, EmailAddress, PhoneNumber, ContactCard } from 'lacona-phrases'
import { dateMap } from './constant-maps'
import { openURL } from 'lacona-api'
import * as constantMaps from './constant-maps'

function spreadElementsFromContacts (data, map) {
  const items = _.chain(data)
    .map(({firstName, middleName, lastName, nickname, company, value, label, id}) => {
      const possibleNames = possibleNameCombinations({firstName, middleName, lastName, nickname, company})
      const qualifiers = [map[label] ? map[label][0] : label]
      return _.map(possibleNames, poss => ({
        text: poss.name,
        value,
        qualifiers: _.concat(qualifiers, poss.qualifiers),
        annotation: {type: 'contact', value: id}
      }))
    })
    .flatten()
    .value()

  return (
    <placeholder argument='contact'>
      <list items={items} limit={10} unique strategy='contain' />
    </placeholder>
  )
}

class ContactObject {
  constructor ({id, name}) {
    this.id = id
    this.name = name
    this.type = 'contact card'
    this.limitId = 'contact-card'
    this[unique] = id
  }

  open () {
    openURL({url: `addressbook://${this.id}`})
  }
}

function contactElementsFromContacts (data) {
  const items = _.chain(data)
    .map(({firstName, middleName, lastName, nickname, company, id}) => {
      const possibleNames = possibleNameCombinations({firstName, middleName, lastName, nickname, company})
      const value = new ContactObject({id, name: possibleNames[0]})
      return _.map(possibleNames, poss => ({
        text: poss.name,
        value,
        qualifiers: poss.qualifiers,
        annotation: {type: 'contact', value: id}
      }))
    })
    .flatten()
    .value()

  return (
    <placeholder argument='contact'>
      <list items={items} limit={10} unique strategy='contain' />
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

  describe ({observe, config}) {
    if (!config.enableContactCards) return
    const data = observe(<Contacts />)
    return contactElementsFromContacts(data)
  }
}

export const ContactEmail = {
  extends: [EmailAddress],
  
  describe ({observe, config}) {
    if (!config.enableContactInfo) return

    const data = observe(<Contacts />)
    const emails = spreadEmails(data)
    return spreadElementsFromContacts(emails, constantMaps.emailLabelMap)
  }
}

export const ContactPhoneNumber = {
  extends: [PhoneNumber],
  
  describe ({observe, config}) {
    if (!config.enableContactInfo) return

    const data = observe(<Contacts />)
    const phoneNumbers = spreadPhoneNumbers(data)
    return spreadElementsFromContacts(phoneNumbers, constantMaps.phoneNumberMap)
  }
}

export const ContactDate = {
  extends: [Day],

  describe ({observe, props, config}) {
    if (!config.enableContactDates) return

    const data = observe(<Contacts />)
    const dates = spreadDates(data)
    const items = _.chain(dates)
      .map(({firstName, middleName, lastName, nickname, company, value, label, id}) => {
        const trueValue = _.clone(value)
        trueValue[unique] = `${id}@${label}`
        const dateNames = dateMap[label] || [label]
        const possibleNames = possibleNameCombinations({firstName, middleName, lastName, nickname})
        return _.map(dateNames, dateName => {
          return _.map(possibleNames, poss => ({
            text: `${poss.name}'s ${dateName}`,
            value: trueValue,
            qualifiers: poss.qualifiers
          }))
        })
      })
      .flattenDeep()
      .value()

    return (
      <placeholder argument='special day'>
        <sequence>
          {props.prepositions ? <literal text='on ' decorate /> : null}
          <list items={items} limit={10} unique strategy='contain' merge />
        </sequence>
      </placeholder>
    )
  }
}
