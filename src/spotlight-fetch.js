import _ from 'lodash'
import {Source} from 'lacona-phrase'

export default class SpotlightFetch extends Source {
  onCreate () {
    this.replaceData([])
    this.currentQueryId = null
  }

  onDeactivate () {
    this.replaceData([])
  }

  onDestroy () {
    global.cancelQuery(this.currentQueryId)
  }

  fetch (query) {
    if (this.currentQueryId != null) {
      global.cancelQuery(this.currentQueryId)
    }
    this.currentQueryId = global.spotlight(query, this.props.attributes, this.props.directories, this.props.limit, this.props.liveUpdate, this.replaceData.bind(this))
  }
}

SpotlightFetch.defaultProps = {
  liveUpdate: false,
  attributes: [],
  directories: [],
  limit: 100
}

SpotlightFetch.preventSharing = true
