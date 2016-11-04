/** @jsx createElement */
import _ from 'lodash'
import {createElement} from 'elliptical'
import {ApplicationSource} from './app'
import {BookmarkSource} from './bookmark'
import {Contacts, UserContact} from './contact-sources'
import {PaneSource} from './preference-pane'
import {RunningAppSource} from './running-app'
import {VolumeSource} from './volume'
import {canAccessContacts} from 'lacona-api'

export default {
  async onLoadConfig ({observe, config, setConfig}) {
    if (config.enableApplications) {
      observe(<ApplicationSource
        namedApplications={config.namedApplications}
        applicationSearchDirectories={config.applicationSearchDirectories} />)
    }

    if (config.enableSafariBookmarks) {
      observe(<BookmarkSource />)
    }

    if (config.enableContactCards || config.enableContactInfo || config.enableContactDates) {
      if (await canAccessContacts()) {
        observe(<Contacts />)
        observe(<UserContact />)
      } else {
        const newConfig = _.clone(config)
        newConfig.enableContactCards = false
        newConfig.enableContactInfo = false
        newConfig.enableContactDates = false
        setConfig(newConfig)
      }
    }

    if (config.enableSystemPreferences) {
      observe(<PaneSource />)
    }

    observe(<RunningAppSource />)
    observe(<VolumeSource />)
  }
}