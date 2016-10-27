import _ from 'lodash'
import {isDemo, fetchContacts, fetchUserContact} from 'lacona-api'
import {Observable} from 'rxjs/Observable'
import {mergeMap} from 'rxjs/operator/mergeMap'
import {startWith} from 'rxjs/operator/startWith'
import {concat} from 'rxjs/operator/concat'
import {fromPromise} from 'rxjs/observable/fromPromise'

export function possibleNameCombinations ({firstName, middleName, lastName, nickname, company}) {
  const possibleNames = []
  if (firstName && lastName) {
    possibleNames.push({name: `${firstName} ${lastName}`, qualifiers: []})
  }
  if (firstName) {
    if (lastName) {
      possibleNames.push({name: firstName, qualifiers: [lastName]})
    } else {
      possibleNames.push({name: firstName, qualifiers: []})
    }
  }
  if (lastName && !firstName) {
    possibleNames.push({name: lastName, qualifiers: []})
  }

  if (company && !firstName && !lastName) {
    possibleNames.push({name: company, qualifiers: []})
  }

  if (nickname) {
    if (firstName && lastName) {
      possibleNames.push({name: nickname, qualifiers: [`${firstName} ${lastName}`]})
    } else if (lastName) {
      possibleNames.push({name: nickname, qualifiers: [lastName]})
    } else if (firstName) {
      possibleNames.push({name: nickname, qualifiers: [firstName]})
    } else {
      possibleNames.push({name: nickname, qualifiers: []})
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
    if (isDemo()) {
      return new Observable((observer) => {
        fetchUserContact.then(contacts => {
          observer.next(contacts)
        })
      })
    } else {
      return fromPromise(fetchUserContact())::concat(
        activate::mergeMap(() => {
          return fromPromise(fetchUserContact())
        })
      )::startWith({})
    }
  }
}

export const Contacts = {
  fetch ({activate}) {
    if (isDemo()) {
      return new Observable((observer) => {
        return fetchContacts().then(contacts => {
          observer.next(contacts)
        })
      })
    } else {
      return fromPromise(fetchContacts())::concat(
        activate::mergeMap(() => {
          return fromPromise(fetchContacts())
        })
      )::startWith([])
    }
  }
}
