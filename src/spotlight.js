// import { Source } from 'lacona-phrase'
// import { querySpotlight } from 'lacona-api'

// export default class Spotlight extends Source {
//   onCreate () {
//     this.replaceData([])

//     this.query = querySpotlight({
//       query: this.props.query,
//       attributes: this.props.attributes,
//       directories: this.props.directories,
//       limit: this.props.limit,
//       liveUpdate: this.props.liveUpdate
//     })

//     this.query.on('data', (data) => {
//       this.setData(data)
//     })
//   }

//   onDestroy () {
//     this.query.cancel()
//   }
// }

// Spotlight.defaultProps = {
//   liveUpdate: false,
//   attributes: [],
//   directories: [],
//   query: '',
//   limit: 100
// }
