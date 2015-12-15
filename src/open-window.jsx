/** @jsx createElement */

import _ from 'lodash'
import {createElement, Phrase, Source} from 'lacona-phrase'
import {Applescript} from './applescript'
import {OpenWindow} from 'lacona-phrase-system-state'

const fetchScript = `
on run
	tell application "System Events"
		set allWindows to {}
		repeat with proc in (processes where background only is false)
			repeat with win in proc's windows
				if win's subrole is "AXStandardWindow" then
					set end of allWindows to {proc's id, proc's name, win's title, my hasCloseButton(win)}
				end if
			end repeat
		end repeat
	end tell
	return allWindows
end run

on hasCloseButton(win)
	tell application "System Events"
		if win's subrole is "AXStandardWindow" then
			repeat with butt in win's buttons
				if butt's subrole is "AXCloseButton" then
					return true
				end if
			end repeat
		end if
		return false
	end tell
end hasCloseButton
`

class WindowObject {
  constructor ({procId, procName, name, closeable}) {
    this.procId = procId
    this.procName = procName
    this.name = name
    this.closeable = closeable
  }

  activate() {
    const script = `
      tell application "System Events"
      	set proc to first process whose background only is false and id is ${this.procId}
      	set win to proc's first window whose name is "${this.name}"
      	perform action "AXRaise" of win
      	set proc's frontmost to true
      end tell
    `
    global.applescript(script)
  }

  close () {
    if (!this.closeable) return

    const script = `
      tell application "System Events"
      	set proc to first process whose background only is false and id is ${this.procId}
      	set win to proc's first window whose name is "${this.name}"
    		set butt to win's first button whose subrole is "AXCloseButton"
    		click butt
      end tell
    `
    global.applescript(script)
  }
}

function objectifyWindow(results) {
	return _.chain(results)
		.map(_.partial(_.zipObject, ['procId', 'procName', 'name', 'closeable']))
		.map(obj => new WindowObject(obj))
		.value()
}

class DemoWindows extends Source {
	onCreate () {
		this.replaceData([])
	}
}

export default class Window extends Phrase {
  source () {
		if (process.env.LACONA_ENV === 'demo') {
			return {windows: <DemoWindows />}
		} else {
	    return {
				windows: (
		      <thru function={objectifyWindow}>
		        <Applescript code={fetchScript} />
		      </thru>
				)
	    }
		}
  }

  describe () {
    const windows = this.sources.windows.data.map(win => ({text: win.name, value: win}))

    return (
      <argument text='window' showForEmpty={true}>
        <list fuzzy={true} items={windows} />
      </argument>
    )
  }
}
Window.extends = [OpenWindow]
