import _ from 'lodash'
import {fetchContacts, fetchUserContact} from 'lacona-api'
import {Observable} from 'rxjs/Observable'
import {mergeMap} from 'rxjs/operator/mergeMap'
import {startWith} from 'rxjs/operator/startWith'

export function possibleNameCombinations ({firstName, middleName, lastName, nickname, company}) {
  const possibleNames = []
  if (firstName && lastName) {
    possibleNames.push(`${firstName} ${lastName}`)
  }
  if (firstName) {
    possibleNames.push(firstName)
  }
  if (lastName && !firstName) {
    possibleNames.push(lastName)
  }

  if (company && !firstName && !lastName) {
    possibleNames.push(company)
  }

  if (nickname) {
    if (firstName && lastName) {
      possibleNames.push(`${firstName} "${nickname}" ${lastName}`)
    }
    if (lastName) {
      possibleNames.push(`${nickname} ${lastName}`)
    }
  }

  return possibleNames
}

export function spreadObject (obj, spreadKey, dataKeys = [], valueKey = 'value', labelKey = 'label') {
  const spreadData = _.chain(obj[spreadKey])
    .map(({value, label}) => {
      return _.assign(
        valueKey ? {[valueKey]: value} : {},
        labelKey ? {[labelKey]: label} : {},
        _.pick(value, dataKeys)
      )
    })
    .value()
  return spreadData
}

export function spread (data, spreadKey, dataKeys = [], valueKey = 'value', labelKey = 'label') {
  const spreadData = _.chain(data)
    .map(item => {
      return _.map(item[spreadKey], ({value, label}) => {
        return _.assign(
          valueKey ? {[valueKey]: value} : {},
          labelKey ? {[labelKey]: label} : {},
          _.pick(item, dataKeys)
        )
      })
    })
    .flatten()
    .value()

  return spreadData
}

export const UserContact = {
  fetch ({activate}) {
    return activate::mergeMap(() => {
      return new Observable((observer) => {
        fetchUserContact((err, contacts) => {
          if (err) {
            console.error(err)
          } else {
            observer.next(contacts)
          }
        })
      })
    })::startWith({})
  }
}

export const Contacts = {
  fetch ({activate}) {
    return activate::mergeMap(() => {
      return new Observable((observer) => {
        fetchContacts((err, contacts) => {
          if (err) {
            console.error(err)
          } else {
            observer.next(contacts)
          }
        })
      })
    })::startWith([])
  }
}
