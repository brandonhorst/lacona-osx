/** @jsx createElement */
import {createElement, Phrase} from 'lacona-phrase'
import Applescript from './applescript'
import {OpenWindow} from 'lacona-phrase-system-state'

const fetchScript = `
  tell application "System Events"
    set allWindows to {}
    repeat with proc in (processes where background only is false)
      repeat with win in proc's windows
        set end of allWindows to {proc's id, proc's name, win's title}
      end repeat
    end repeat
  end tell
  return allWindows
`

function switchTo(procId, title) {
  const switchScript = `
  tell application "System Events"
    set proc to first proc where id = ${procId}
    repeat with win in proc's windows where windowName = "${title}"
      close win
    end repeat
  end tell
  `

}

export default class Window extends Phrase {
  source () {
    // return {windows: <Applescript script='fetchOpenWindows' keys={['name']} />}
    return {windows: <Applescript code={fetchScript} keys={['procId', 'procName', 'title']} />}
  }

  describe () {
    const windows = this.sources.windows.data.map(win => ({text: win.title, value: win.name}))

    return (
      <argument text='window'>
        <list fuzzy={true} items={windows} />
      </argument>
    )
  }
}
Window.extends = [OpenWindow]
