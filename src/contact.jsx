/** @jsx createElement */

import _ from 'lodash'
import { Contacts, possibleNameCombinations, spread } from './contact-sources'
import { createElement } from 'elliptical'
import { Day } from 'elliptical-datetime'
import { dateMap } from './constant-maps'
import { EmailAddress } from 'elliptical-email'
import { PhoneNumber } from 'elliptical-phone'

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

function  spreadEmails (ary) {
  return spread(ary, 'emails', ['firstName', 'lastName', 'middleName', 'nickname', 'company'])
}

function  spreadPhoneNumbers (ary) {
  return spread(ary, 'phoneNumbers', ['firstName', 'lastName', 'middleName', 'nickname', 'company'])
}

function  spreadDates (ary) {
  return spread(ary, 'dates', ['firstName', 'lastName', 'middleName', 'nickname', 'company'])
}

export const ContactEmail = {
  extends: [EmailAddress],
  observe () {
    return <Contacts />
  },

  describe({data}) {
    const emails = spreadEmails(data)
    return elementsFromContacts(emails)
  }
}

export const ContactPhoneNumber = {
  extends: [PhoneNumber],

  observe () {
    return <Contacts />
  },
  
  describe({data}) {
    const phoneNumbers = spreadPhoneNumbers(data)
    return elementsFromContacts(phoneNumbers)
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
