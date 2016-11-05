/** @jsx createElement */
import {createElement} from 'elliptical'
import {Directory, URL} from 'lacona-phrases'
import {userHome, runApplescript} from 'lacona-api'
import {onActivate} from 'lacona-source-helpers'

const FETCH_CURRENT_FINDER_DIRECTORY_SCRIPT = `
  set dir to ""
  set frontApp to ""

  tell application "System Events"
    set frontApp to name of first application process whose frontmost is true
  end tell

  if (frontApp is "Finder") then
    tell application "Finder"
      if (count of Finder windows) is not 0 then
        set currentDir to (target of front Finder window) as text
        set dir to (POSIX path of currentDir)
      end if
    end tell
  end if

  return dir
`

const FETCH_CURRENT_SAFARI_URL_SCRIPT = `
  set theURL to ""
  if is_running("Safari") then
    set theURL to run script "
      set theURL to \\"\\"
      set frontApp to \\"\\"
      tell application \\"System Events\\"
        set frontApp to name of first application process whose frontmost is true
      end tell

      if (frontApp is \\"Safari\\") then
        tell application \\"Safari\\"
          set theURL to URL of document 1
        end tell
      end if

      return theURL
    "
  end if

  on is_running(appName)
    tell application "System Events" to (name of processes) contains appName
  end is_running

  return theURL
`

async function fetchCurrentDirectory () {
  const dir = await runApplescript({script: FETCH_CURRENT_FINDER_DIRECTORY_SCRIPT})
  if (dir) {
    return {
      path: dir,
      argument: 'finder directory',
      annotation : {type: 'icon', value: '/System/Library/CoreServices/Finder.app'}
    }
  } else {
    return {}
  }
}

const CurrentDirectorySource = onActivate(fetchCurrentDirectory, {})

async function fetchCurrentURL () {
  const url = await runApplescript({script: FETCH_CURRENT_SAFARI_URL_SCRIPT})
  if (url) {
    return {
      url: url,
      argument: 'safari URL',
      annotation : {type: 'icon', value: '/Applications/Safari.app'}
    }
  } else {
    return {}
  }
}

const CurrentURLSource = onActivate(fetchCurrentURL, {})

export const ContextDirectory = {
  extends: [Directory],

  describe ({observe, config}) {
    if (!config.enableContextDirectory) return

    const context = observe(<CurrentDirectorySource />)
    if (context.path) {
      const expandedPath = context.path.replace(/^~/, userHome())
      return (
        <placeholder argument={context.argument || 'directory'} suppressEmpty={false}>
          <list items={[
            {text: context.path},
            {text: context.argument, category:'symbol'},
            {text: 'context directory', category: 'symbol'}
          ]} value={expandedPath} annotation={context.annotation} limit={1} />
        </placeholder>
      )
    }
  }
}

export const ContextURL = {
  extends: [URL],

  describe ({observe, config}) {
    if (!config.enableContextURL) return

    const context = observe(<CurrentURLSource />)

    if (context.url) {
      return (
        <placeholder argument={context.argument || 'url'} suppressEmpty={false}>
          <list items={[
            {text: context.url},
            {text: context.argument, category:'symbol'},
            {text: 'context url', category: 'symbol'}
          ]} value={context.url} annotation={context.annotation} limit={1} />
        </placeholder>
      )
    }
  }
}