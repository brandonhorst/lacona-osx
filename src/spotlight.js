import {Source} from 'lacona-phrase'

export default class Spotlight extends Source {
  onCreate () {
    this.replaceData([])

    this.queryId = global.spotlight(this.props.query, this.props.attributes, this.props.directories, this.props.limit, this.props.liveUpdate, data => {
      this.replaceData(data)
    })
  }

  onDestroy () {
    global.cancelQuery(this.queryId)
  }
}
Spotlight.defaultProps = {
  liveUpdate: false,
  attributes: [],
  directories: [],
  query: '',
  limit: 100
}
