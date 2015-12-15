import _ from 'lodash'
import {Source} from 'lacona-phrase'

export class Applescript extends Source {
  onCreate () {
    this.triggered = false
    this.replaceData([])

    if (this.props.fetchOn === 'create') { this.fetch() }
    if (this.props.fetchOn === 'activate') { this.fetch() }
  }

  onActivate () {
    if (this.props.fetchOn === 'activate') { this.fetch() }
  }

  onDeactivate () {
    if (this.props.fetchOn === 'activate') { this.replaceData([]) }
    // if (this.props.fetchOn === 'triggerOnce') {
    //   this.triggered = false
    // }
  }

  trigger () {
    if (this.props.fetchOn === 'triggerOnce' && !this.triggered) {
      this.fetch()
      this.triggered = true
    } else if (this.props.fetchOn === 'trigger') {
      this.fetch()
    }
  }

  fetch () {
    global.applescript(this.props.code, (err, data) => {
      if (err) {
        console.log('Applescript Error:')
        console.log(err)
        return
      }
      this.replaceData(data)
    })
  }
}

Applescript.defaultProps = {
  fetchOn: 'create'
}
