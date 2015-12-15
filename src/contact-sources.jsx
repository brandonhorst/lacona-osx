/** @jsx createElement */

import _ from 'lodash'
import {createElement, Source} from 'lacona-phrase'

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

export class UserContact extends Source {
  onCreate () {
    if (process.env.LACONA_ENV === 'demo') {
      this.replaceData(global.config.userContact)
    } else {
      this.replaceData([])
      global.userContact((err, contact) => {
        this.replaceData(contact)
      })
    }
  }
}

export class Contacts extends Source {
  onCreate () {
    if (process.env.LACONA_ENV === 'demo') {
      this.replaceData(global.config.contacts)
    } else {
      this.replaceData([])
      global.allContacts((err, contacts) => {
        this.replaceData(contacts)
      })
    }
  }
}

/*
If its source looks like this:
[{a: 1, b: [{value, ...

*/
// export class Spread extends Source {
//   source () {
//     return {contacts: this.props.children[0]}
//   }
//
//   onCreate () {
//     this.replaceData([])
//   }
//
//   onUpdate () {
//     const spreadData = _.chain(this.sources.contacts.data)
//       .map(contact => {
//         return _.map(contact[this.props.spreadKey], ({value, label}) => {
//           return _.assign(
//             this.props.valueKey ? {[this.props.valueKey]: value} : {},
//             this.props.labelKey ? {[this.props.labelKey]: label} : {},
//             _.pick(contact, this.props.dataKeys)
//           )
//         })
//       })
//       .flatten()
//       .value()
//
//     this.replaceData(spreadData)
//   }
// }
//
// Spread.defaultProps = {
//   dataKeys: [],
//   valueKey: 'value',
//   labelKey: 'label'
// }
//
// export class SpreadObject extends Source {
//   source () {
//     return {contact: this.props.children[0]}
//   }
//
//   onCreate () {
//     this.replaceData([])
//   }
//
//   onUpdate () {
//     const spreadData = _.chain(this.sources.contact.data[this.props.spreadKey])
//       .map(({value, label}) => {
//         return _.assign(
//           this.props.valueKey ? {[this.props.valueKey]: value} : {},
//           this.props.labelKey ? {[this.props.labelKey]: label} : {},
//           _.pick(this.sources.contact.data, this.props.dataKeys)
//         )
//       })
//       .value()
//
//     this.replaceData(spreadData)
//   }
// }
//
// SpreadObject.defaultProps = {
//   dataKeys: [],
//   valueKey: 'value',
//   labelKey: 'label'
// }
//
// export class SpreadUserContact extends Source {
//   source () {
//     return {user: <UserContact />}
//   }
//
//   onCreate () {
//     this.replaceData([])
//   }
//
//   onUpdate () {
//     if (_.isEmpty(this.sources.user.data)) return
//
//     const spreadData = _.chain(this.sources.user.data[this.props.spreadKey])
//       .map(contact => {
//         return _.map(contact[this.props.spreadKey], ({value, label}) => {
//           const returnObj = {value, label}
//           for (let dataKey in this.props.dataKeys) {
//             returnObj[dataKey] = contact.dataKey
//           }
//           return returnObj
//         })
//       })
//       .value()
//
//     this.replaceData(spreadData)
//   }
//
// }
