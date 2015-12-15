/** @jsx createElement */

import _ from 'lodash'
import {createElement, Phrase, Source} from 'lacona-phrase'
import {Date as DatePhrase} from 'lacona-phrase-datetime'
import Email from 'lacona-phrase-email'
import PhoneNumber from 'lacona-phrase-phonenumber'
import {dateMap, relationshipMap} from './constant-maps'
import {spread, spreadObject, UserContact} from './contact-sources'

const relationships = (
  <thru function={_.partial(spreadObject, _, 'relationships', ['phoneNumbers', 'emails', 'dates'], null, 'relationship')}>
    <UserContact />
  </thru>
)

class RelationshipPhrase extends Phrase {
  describe () {
    const items = _.chain(this.sources.relationships.data)
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
      <argument text='relationship' showForEmpty={true}>
        <choice>
          {items}
        </choice>
      </argument>
    )
  }
}

export class RelationshipPhoneNumber extends RelationshipPhrase {
  source () {
    return {
      relationships: (
        <thru function={_.partial(spread, _, 'phoneNumbers', ['relationship'])}>
          {relationships}
        </thru>
      )
    }
  }
}
RelationshipPhoneNumber.extends = [PhoneNumber]

export class RelationshipEmail extends RelationshipPhrase {
  source () {
    return {
      relationships: (
        <thru function={_.partial(spread, _, 'emails', ['relationship'])}>
          {relationships}
        </thru>
      )
    }
  }
}
RelationshipEmail.extends = [Email]

export class RelationshipDate extends Phrase {
  source () {
    return {
      contacts: (
        <thru function={_.partial(spread, _, 'dates', ['relationship'])}>
          {relationships}
        </thru>
      )
    }
  }

  describe () {
    const items = _.chain(this.sources.contacts.data)
      .map(({relationship, value, label}) => {
        const relationships = relationshipMap[relationship] || [relationship]
        const dateNames = dateMap[label] || [label]
        return (
          <choice limit={1} value={value}>
            {_.map(dateNames, dateName => {
              return [
                _.map(relationships, oneRelationship => (
                  <sequence>
                    <argument text='relationship'>
                      <literal text={`my ${oneRelationship.toLowerCase()}'s `} />
                    </argument>
                    <argument text='special date'>
                      <literal text={dateName} />
                    </argument>
                  </sequence>
                )),
                _.map(relationships, oneRelationship => (
                  <sequence>
                    <argument text='relationship'>
                      <literal text={`${_.capitalize(oneRelationship)}'s `} />
                    </argument>
                    <argument text='special date'>
                      <literal text={dateName} />
                    </argument>
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
        {this.props.prepositions ? <literal text='on ' category='conjunction' optional limited prefered /> : null}
        <choice merge>
          {items}
        </choice>
      </sequence>
    )
  }
}
RelationshipDate.extends = [DatePhrase]
