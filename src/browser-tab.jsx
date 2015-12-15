/** @jsx createElement */

import _ from 'lodash'
import {createElement, Phrase, Source} from 'lacona-phrase'
import {Applescript} from './applescript'
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
            set end of allTabs to {\\"Safari\\", {win's index, t's index}, t's name}
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

class TabObject {
  constructor ({appName, tabId, name}) {
    this.appName = appName
    this.tabId = tabId
    this.name = name
  }

  close() {

  }

  activate() {
    let script

    if (this.appName === 'Google Chrome') {
      script = `
        tell application "Google Chrome"
        	repeat with wi from 1 to count windows
        		repeat with ti from 1 to count (window wi's tabs)
        			if id of window wi's tab ti is ${this.tabId} then
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
    } else if (this.appName === 'Safari') {
      const [winId, tabId] = this.tabId
      //TODO THIS DOES NOT WORK
      script = `
        tell application "Safari"
        	activate
          set win to window ${winId}
        	set win's current tab to win's tab ${tabId}
          set win's index to 1
        end tell
      `
    }
    global.applescript(script)
  }
}

function toObject(obj) {
  return new TabObject(obj)
}

const objectify = _.partial(_.zipObject, ['appName', 'tabId', 'name'])

class DemoTabs extends Source {
	onCreate () {
		this.replaceData([])
	}
}

export default class Tab extends Phrase {
  source () {
    if (process.env.LACONA_ENV === 'demo') {
      return {tabs: <DemoTabs />}
    } else {
      return {
        tabs: (
          <map function={toObject}>
            <map function={objectify}>
              <Applescript code={fetchScript} fetchOn='activate' />
            </map>
          </map>
        )
      }
    }
  }

  describe () {
    const tabs = this.sources.tabs.data.map(tab => ({text: tab.name, value: tab}))

    return (
      <argument text='tab'>
        <list fuzzy={true} items={tabs} />
      </argument>
    )
  }
}
Tab.extends = [BrowserTab]
