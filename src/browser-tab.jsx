/** @jsx createElement */
import {createElement, Phrase} from 'lacona-phrase'
import Applescript from './applescript'
import {BrowserTab} from 'lacona-phrase-system-state'

const fetchScript = `
  set chromeTabs to {}
  set safariTabs to {}

  if is_running("Google Chrome") then
    set chromeTabs to run script "
      set allTabs to {}
      tell application \\"Google Chrome\\"
        repeat with win in every window
          repeat with t in win's tabs
            set end of allTabs to {\\"Google Chrome\\", t's id, title of t}
          end repeat
        end repeat
      end tell
      return allTabs
    "
  end if

  if is_running("Safari") then
    set safariTabs to run script "
      set allTabs to {}
      tell application \\"Safari\\"
        repeat with win in (windows where visible is true)
          repeat with t in win's tabs
            set end of allTabs to {\\"Safari\\", (win's index as string) & \\"-\\" & (t's index as string), t's name}
          end repeat
        end repeat
      end tell
      return allTabs
    "
  end if

  on is_running(appName)
    tell application "System Events" to (name of processes) contains appName
  end is_running

  return chromeTabs & safariTabs
`

export function closeTab(id) {

}

export function switchToTab({app, id}) {
  let script
  if (app === 'Google Chrome') {
    script = `
      tell application "Google Chrome"
      	repeat with wi from 1 to count windows
      		repeat with ti from 1 to count (window wi's tabs)
      			if id of window wi's tab ti is ${id} then
      				set theTab to ti
      				set theWin to wi
      			end if
      		end repeat
      	end repeat

      	set window theWin's active tab index to theTab
      	set window theWin's index to 1
      	activate
      end tell
    `
  } else if (app === 'Safari') {
    const [winId, tabId] = id.split('-')
    //TODO THIS DOES NOT WORK
    script = `
      tell application "Safari"
      	activate
      	set window ${winId}'s current tab to window ${winId}'s tab ${tabId}
        set window ${winId}'s index to 1
      end tell
    `
  }

  global.applescript(script)
}

export default class Tab extends Phrase {
  source () {
    return {tabs: <Applescript code={fetchScript} keys={['appName', 'tabId', 'name']} fetchOn='activate' />}
  }

  describe () {
    const tabs = this.sources.tabs.data.map(tab => ({text: tab.name, value: {app: tab.appName, id: tab.tabId}}))

    return (
      <argument text='tab'>
        <list fuzzy={true} items={tabs} />
      </argument>
    )
  }
}
Tab.extends = [BrowserTab]
