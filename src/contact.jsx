/** @jsx createElement */

import _ from 'lodash'
import {Contacts, possibleNameCombinations, Spread} from './contact-sources'
import {createElement, Phrase, Source} from 'lacona-phrase'
import {Date as DatePhrase} from 'lacona-phrase-datetime'
import {dateMap} from './constant-maps'
import Email from 'lacona-phrase-email'
import PhoneNumber from 'lacona-phrase-phonenumber'

function elementsFromContacts(data) {
  const elements = _.chain(data)
    .map(({firstName, middleName, lastName, nickname, company, value, label}) => {
      const possibleNames = possibleNameCombinations({firstName, middleName, lastName, nickname, company})
      const items = _.map(possibleNames, text => ({text, value}))


      return <list items={items} limit={1} />
    })
    .value()

  return (
    <argument text='contact' showForEmpty={true}>
      <choice limit={10}>
        {elements}
      </choice>
    </argument>
  )
}

class ContactPhrase extends Phrase {
  describe () {
    return elementsFromContacts(this.sources.contacts.data)
  }
}

export class ContactEmail extends ContactPhrase {
  source () {
    return {
      contacts: (
        <Spread spreadKey='emails' dataKeys={['firstName', 'lastName', 'middleName', 'nickname', 'company']}>
          <Contacts />
        </Spread>
      )
    }
  }
}
ContactEmail.extends = [Email]

export class ContactPhoneNumber extends ContactPhrase {
  source () {
    return {
      contacts: (
        <Spread spreadKey='phoneNumbers' dataKeys={['firstName', 'lastName', 'middleName', 'nickname', 'company']}>
          <Contacts />
        </Spread>
      )
    }
  }
}
ContactPhoneNumber.extends = [PhoneNumber]

export class ContactDate extends Phrase {
  source () {
    return {
      contacts: (
        <Spread spreadKey='dates' dataKeys={['firstName', 'middleName', 'lastName', 'nickname']}>
          <Contacts />
        </Spread>
      )
    }
  }

  describe () {
    const items = _.chain(this.sources.contacts.data)
      .map(({firstName, middleName, lastName, nickname, company, value, label}) => {
        const dateNames = dateMap[label] || [label]
        const possibleNames = possibleNameCombinations({firstName, middleName, lastName, nickname})
        return (
          <choice limit={1} value={value}>
            {_.map(dateNames, dateName => {
              return _.map(possibleNames, possibleName => <literal text={`${possibleName}'s ${dateName}`} />)
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
ContactDate.extends = [DatePhrase]
