/** @jsx createElement */

import _ from 'lodash'
import {createElement, Phrase, Source} from 'lacona-phrase'
import {Date as DatePhrase} from 'lacona-phrase-datetime'
import Email from 'lacona-phrase-email'
import PhoneNumber from 'lacona-phrase-phonenumber'
import {dateMap, relationshipMap} from './constant-maps'
import {Spread, SpreadObject, UserContact} from './contact-sources'

export class Relationships extends Source {
  source () {
    return {
      relationships: (
        <SpreadObject spreadKey='relationships' labelKey='relationship' valueKey={null} dataKeys={['phoneNumbers', 'emails', 'dates']}>
          <UserContact />
        </SpreadObject>
      )
    }
  }

  onCreate () {this.replaceData([])}

  onUpdate () {
    this.replaceData(this.sources.relationships.data)
  }
}

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
        <Spread spreadKey='phoneNumbers' dataKeys={['relationship']}>
          <Relationships />
        </Spread>
      )
    }
  }
}
RelationshipPhoneNumber.extends = [PhoneNumber]

export class RelationshipEmail extends RelationshipPhrase {
  source () {
    return {
      relationships: (
        <Spread spreadKey='emails' dataKeys={['relationship']}>
          <Relationships />
        </Spread>
      )
    }
  }
}
RelationshipEmail.extends = [Email]

export class RelationshipDate extends Phrase {
  source () {
    return {
      contacts: (
        <Spread spreadKey='dates' dataKeys={['relationship']}>
          <Relationships />
        </Spread>
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
                _.map(relationships, oneRelationship => <literal text={`my ${oneRelationship.toLowerCase()}'s ${dateName}`} />),
                _.map(relationships, oneRelationship => <literal text={`${_.capitalize(oneRelationship)}'s ${dateName}`} />)
              ]
            })}
          </choice>
        )
      })
      .value()

    return (
      <sequence>
        <literal text='on ' category='conjunction' optional={true} limited={true} prefered={false} />
        <argument text='birthday'>
          <choice>
            {items}
          </choice>
        </argument>
      </sequence>
    )
  }
}
RelationshipDate.extends = [DatePhrase]
