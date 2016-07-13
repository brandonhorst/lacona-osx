/** @jsx createElement */

import _ from 'lodash'
import { createElement } from 'elliptical'
import { Day, EmailAddress, PhoneNumber } from 'lacona-phrases'
import { dateMap, relationshipMap, phoneNumberMap, emailLabelMap } from './constant-maps'
import { spread, spreadObject, UserContact } from './contact-sources'

function spreadRelationships (obj) {
  return spreadObject(obj, 'relationships', ['phoneNumbers', 'emails', 'dates', 'id', 'firstName', 'lastName', 'company'], null, 'relationship')
}

function spreadPhoneNumbers (ary) {
  return spread(ary, 'phoneNumbers', ['relationship', 'id', 'firstName', 'lastName', 'company'])
}

function spreadEmails (ary) {
  return spread(ary, 'emails', ['relationship', 'id', 'firstName', 'lastName', 'company'])
}

function spreadDates (ary) {
  return spread(ary, 'dates', ['relationship', 'id', 'firstName', 'lastName', 'company'])
}

function getNameQualifiers ({firstName, lastName, company}) {
  if (firstName && lastName) {
    return [firstName, `${firstName} ${lastName}`]
  } else if (firstName || lastName) {
    return [firstName || lastName]
  } else if (company) {
    return [company]
  }
}

function describeRelationship (data, map) {
  const items = _.chain(data)
    .map(({relationship, value, label, id, firstName, lastName, company}) => {
      const relationships = relationshipMap[relationship] || [relationship]
      const qualifiers = getNameQualifiers({firstName, lastName, company})
      qualifiers.push([map[label] ? map[label][0] : label])
      const annotation = {type: 'contact', id}
      return (
        <choice limit={1} value={value} annotation={annotation} qualifiers={qualifiers}>
          {_.map(relationships, oneRelationship => (
            <literal strategy='fuzzy' text={`my ${oneRelationship.toLowerCase()}`} />
          ))}
          {_.map(relationships, oneRelationship => (
            <literal strategy='fuzzy' text={`${_.capitalize(oneRelationship)}`} />
          ))}
        </choice>
      )
    })
    .value()

  return (
    <placeholder argument='relationship'>
      <choice>
        {items}
      </choice>
    </placeholder>
  )
}

export const RelationshipPhoneNumber = {
  extends: [PhoneNumber],

  describe ({observe}) {
    const data = observe(<UserContact />)
    const phoneNumbers = spreadPhoneNumbers(spreadRelationships(data))
    return describeRelationship(phoneNumbers, phoneNumberMap)
  }
}

export const RelationshipEmail = {
  extends: [EmailAddress],

  describe ({observe}) {
    const data = observe(<UserContact />)
    const emails = spreadEmails(spreadRelationships(data))
    return describeRelationship(emails, emailLabelMap)
  }
}

export const RelationshipDate = {
  extends: [Day],

  describe ({observe, props}) {
    const data = observe(<UserContact />)
    const dates = spreadDates(spreadRelationships(data))
    const items = _.chain(dates)
      .map(({relationship, value, label, id, firstName, lastName, company}) => {
        const relationships = relationshipMap[relationship] || [relationship]
        const dateNames = dateMap[label] || [label]
        const annotation = {type: 'contact', id}
        const qualifiers = getNameQualifiers({firstName, lastName, company})
        return (
          <choice limit={1} value={value} annotation={annotation} qualifiers={qualifiers}>
            {_.map(dateNames, dateName => {
              return [
                _.map(relationships, oneRelationship => (
                  <sequence>
                    <placeholder argument='relationship'>
                      <literal strategy='fuzzy' text={`my ${oneRelationship.toLowerCase()}'s`} />
                    </placeholder>
                    <literal text=' ' />
                    <placeholder argument='special day'>
                      <literal strategy='fuzzy' text={dateName} />
                    </placeholder>
                  </sequence>
                )),
                _.map(relationships, oneRelationship => (
                  <sequence>
                    <placeholder argument='relationship'>
                      <literal text={`${_.capitalize(oneRelationship)}'s`} />
                    </placeholder>
                    <literal text=' ' />
                    <placeholder argument='special day'>
                      <literal text={dateName} />
                    </placeholder>
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
        <placeholder argument='special day' merge>
          <choice>
            {items}
          </choice>
        </placeholder>
      </sequence>
    )
  }
}
