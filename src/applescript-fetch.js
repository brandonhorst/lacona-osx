import {Source} from 'lacona-phrase'

export default class Applescript extends Source {
  onCreate () {
    this.replaceData([])

    global.applescript(this.props.code, this.props.keys, (err, data) => {
      if (err) {
        console.log('Applescript Error:')
        console.log(err)
        return
      }
      this.replaceData(data)
    })
  }
}
