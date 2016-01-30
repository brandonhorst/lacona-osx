/** @jsx createElement */

import _ from 'lodash'
import { createElement, Phrase } from 'lacona-phrase'
import { Day } from 'lacona-phrase-datetime'
import { EmailAddress } from 'lacona-phrase-email'
import { PhoneNumber } from 'lacona-phrase-phone-number'
import { dateMap, relationshipMap } from './constant-maps'
import { spread, spreadObject, UserContact } from './contact-sources'

const relationships = (
  <map function={_.partial(spreadObject, _, 'relationships', ['phoneNumbers', 'emails', 'dates'], null, 'relationship')}>
    <UserContact />
  </map>
)

class RelationshipPhrase extends Phrase {
  describe () {
    const items = _.chain(this.source.data)
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
}

function spreadPhoneNumbers (ary) {
  return spread(ary, 'phoneNumbers', ['relationship'])
}

export class RelationshipPhoneNumber extends RelationshipPhrase {
  static extends = [PhoneNumber]

  observe () {
    return (
      <map function={spreadPhoneNumbers}>
        {relationships}
      </map>
    )
  }
}

function spreadEmails (ary) {
  return spread(ary, 'emails', ['relationship'])
}

export class RelationshipEmail extends RelationshipPhrase {
  static extends = [EmailAddress]

  observe () {
    return (
      <map function={spreadEmails}>
        {relationships}
      </map>
    )
  }
}

function spreadDates (ary) {
  return spread(ary, 'dates', ['relationship'])
}

export class RelationshipDate extends Phrase {
  static extends = [Day]

  observe () {
    return (
      <map function={spreadDates}>
        {relationships}
      </map>
    )
  }

  describe () {
    const items = _.chain(this.source.data)
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
        {this.props.prepositions ? <literal text='on ' category='conjunction' optional limited preferred /> : null}
        <label text='special day' merge>
          <choice>
            {items}
          </choice>
        </label>
      </sequence>
    )
  }
}
