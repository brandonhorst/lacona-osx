/** @jsx createElement */

import _ from 'lodash'
import { createElement, Phrase } from 'lacona-phrase'
import { Command } from 'lacona-command'
import { shutdown, restart, logOut, sleep, lock, turnOffDisplay, turnOnScreensaver, emptyTrash } from 'lacona-api'

class SystemCommandObject {
  constructor ({verb}) {
    this.verb = verb
  }

  _demoExecute () {
    if (this.verb === 'restart') {
      return [{text: 'restart the computer', category: 'action'}]
    } else if (this.verb === 'shutdown') {
      return [{text: 'shut the computer down', category: 'action'}]
    } else if (this.verb === 'sleep') {
      return [{text: 'put the computer to sleep', category: 'action'}]
    } else if (this.verb === 'lock') {
      return [{text: 'lock the computer', category: 'action'}]
    } else if (this.verb === 'log out') {
      return [{text: 'log out of the computer', category: 'action'}]
    } else if (this.verb === 'empty-trash') {
      return [{text: 'empty the trash', category: 'action'}]
    } else if (this.verb === 'screensaver') {
      return [{text: 'turn on the screensaver', category: 'action'}]
    } else if (this.verb === 'display-off') {
      return [{text: 'turn the display off', category: 'action'}]
    }
  }

  execute () {
    if (this.verb === 'restart') {
      restart()
    } else if (this.verb === 'shutdown') {
      shutdown()
    } else if (this.verb === 'sleep') {
      sleep()
    } else if (this.verb === 'lock') {
      lock()
    } else if (this.verb === 'log out') {
      logOut()
    } else if (this.verb === 'empty-trash') {
      emptyTrash()
    } else if (this.verb === 'screensaver') {
      turnOnScreensaver()
    } else if (this.verb === 'display-off') {
      turnOffDisplay()
    }
  }
}

export class SystemCommand extends Phrase {
  static extends = [Command]

  describe () {
    return (
      <map function={result => new SystemCommandObject(result)}>
        <choice>
          <sequence>
            <list items={[
                {text: 'restart', value: 'restart'},
                {text: 'shutdown', value: 'shutdown'},
                {text: 'sleep', value: 'sleep'},
                {text: 'lock', value: 'lock'},
                {text: 'log out', value: 'log out'},
                {text: 'logout', value: 'log out'},
                {text: 'log off', value: 'log out'},
                {text: 'logoff', value: 'log out'}
              ]} category='action' id='verb' limit={5} />
            <list items={[' computer', ' the computer', ' system', ' the system']} limit={1} optional limited category='action' />
          </sequence>
          <sequence id='verb' value='empty-trash'>
            <literal text='empty ' category='action' />
            <literal text='the ' optional limited category='action' />
            <literal text='Trash' category='action' />
          </sequence>
          <sequence id='verb' value='screensaver'>
            <literal text='turn on ' category='action'/>
            <literal text='the ' optional limited category='action' />
            <list items={['screensaver', 'screensaver']} limit={1} category='action' />
          </sequence>
          <sequence id='verb'>
            <literal text='turn off ' category='action' />
            <literal text='the ' optional limited category='action' />
            <choice merge>
              <list items={['display', 'screen']} limit={1} category='action' value='display-off' />
              <list items={['computer', 'system']} limit={1} category='action' value='shutdown' />
            </choice>
          </sequence>
        </choice>
      </map>
    )
  }
}
