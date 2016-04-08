/** @jsx createElement */

import _ from 'lodash'
import { createElement } from 'elliptical'
import { Day } from 'elliptical-datetime'
import { EmailAddress } from 'elliptical-email'
import { PhoneNumber } from 'elliptical-phone'
import { dateMap, relationshipMap } from './constant-maps'
import { spread, spreadObject, UserContact } from './contact-sources'

function spreadRelationships (obj) {
  return spreadObject(obj, 'relationships', ['phoneNumbers', 'emails', 'dates'], null, 'relationship')
}

function spreadPhoneNumbers (ary) {
  return spread(ary, 'phoneNumbers', ['relationship'])
}

function spreadEmails (ary) {
  return spread(ary, 'emails', ['relationship'])
}

function spreadDates (ary) {
  return spread(ary, 'dates', ['relationship'])
}

function describeRelationship (data) {
  const items = _.chain(data)
    .map(({relationship, value, label}) => {
      const relationships = relationshipMap[relationship] || [relationship]
      return (
        <choice limit={1} value={value}>
          {_.map(relationships, oneRelationship => <literal text={`my ${oneRelationship.toLowerCase()}`} />)}
          {_.map(relationships, oneRelationship => <literal text={`${_.capitalize(oneRelationship)}`} />)}
        </choice>
      )
    })
    .value()

  return (
    <label text='relationship'>
      <choice>
        {items}
      </choice>
    </label>
  )
}

export const RelationshipPhoneNumber = {
  extends: [PhoneNumber],

  observe () {
    return <UserContact />
  },

  describe ({data}) {
    const phoneNumbers = spreadPhoneNumbers(spreadRelationships(data))
    return describeRelationship(phoneNumbers)
  }
}

export const RelationshipEmail = {
  extends: [EmailAddress],

  observe () {
    return <UserContact />
  },

  describe ({data}) {
    const emails = spreadEmails(spreadRelationships(data))
    return describeRelationship(emails)
  }
}

export const RelationshipDate = {
  extends: [Day],

  observe () {
    return <UserContact />
  },

  describe ({data, props}) {
    const dates = spreadDates(spreadRelationships(data))
    const items = _.chain(dates)
      .map(({relationship, value, label}) => {
        const relationships = relationshipMap[relationship] || [relationship]
        const dateNames = dateMap[label] || [label]
        return (
          <choice limit={1} value={value}>
            {_.map(dateNames, dateName => {
              return [
                _.map(relationships, oneRelationship => (
                  <sequence>
                    <label text='relationship'>
                      <literal text={`my ${oneRelationship.toLowerCase()}'s`} />
                    </label>
                    <literal text=' ' />
                    <label text='special day'>
                      <literal text={dateName} />
                    </label>
                  </sequence>
                )),
                _.map(relationships, oneRelationship => (
                  <sequence>
                    <label text='relationship'>
                      <literal text={`${_.capitalize(oneRelationship)}'s`} />
                    </label>
                    <literal text=' ' />
                    <label text='special day'>
                      <literal text={dateName} />
                    </label>
                  </sequence>
                ))
              ]
            })}
          </choice>
        )
      })
      .value()

    return (
      <sequence>
        {props.prepositions ? <literal text='on ' category='conjunction' optional limited preferred /> : null}
        <label text='special day' merge>
          <choice>
            {items}
          </choice>
        </label>
      </sequence>
    )
  }
}
