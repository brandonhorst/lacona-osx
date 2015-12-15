/** @jsx createElement */

import _ from 'lodash'
import {Contacts, possibleNameCombinations, spread } from './contact-sources'
import {createElement, Phrase, Source} from 'lacona-phrase'
import {Date as DatePhrase} from 'lacona-phrase-datetime'
import {dateMap} from './constant-maps'
import Email from 'lacona-phrase-email'
import PhoneNumber from 'lacona-phrase-phonenumber'

function elementsFromContacts (data) {
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
        <thru function={_.partial(spread, _, 'emails', ['firstName', 'lastName', 'middleName', 'nickname', 'company'])}>
          <Contacts />
        </thru>
      )
    }
  }
}
ContactEmail.extends = [Email]

export class ContactPhoneNumber extends ContactPhrase {
  source () {
    return {
      contacts: (
        <thru function={_.partial(spread, _, 'phoneNumbers', ['firstName', 'lastName', 'middleName', 'nickname', 'company'])}>
          <Contacts />
        </thru>
      )
    }
  }
}
ContactPhoneNumber.extends = [PhoneNumber]

export class ContactDate extends Phrase {
  source () {
    return {
      contacts: (
        <thru function={_.partial(spread, _, 'dates', ['firstName', 'lastName', 'middleName', 'nickname', 'company'])}>
          <Contacts />
        </thru>
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
              return _.map(possibleNames, possibleName => (
                <sequence>
                  <argument text='contact'>
                    <literal text={`${possibleName}'s `} />
                  </argument>
                  <argument text='special date'>
                    <literal text={dateName} />
                  </argument>
                </sequence>
              ))
            })}
          </choice>
        )
      })
      .value()

    return (
      <sequence>
        {this.props.prepositions ? <literal text='on ' category='conjunction' optional limited prefered /> : null}
        <choice limit={10}>
          {items}
        </choice>
      </sequence>
    )
  }
}

ContactDate.extends = [DatePhrase]
