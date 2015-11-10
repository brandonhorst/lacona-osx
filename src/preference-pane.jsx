/** @jsx createElement */
import PreferencePane from 'lacona-phrase-preference-pane'
import {createElement, Phrase} from 'lacona-phrase'
import Spotlight from './spotlight'

export default class Pane extends Phrase {
  source () {
    return {panes: <Spotlight directories={['/Applications']} query="kMDItemContentTypeTree == 'com.apple.systempreference.prefpane'" attributes={['kMDItemDisplayName', 'kMDItemPath']}/>}
  }

  describe () {
    const panes = this.sources.panes.data.map(pane => ({text: pane.kMDItemDisplayName, value: pane.kMDItemPath}))

    return (
      <argument text='preference pane'>
        <list fuzzy={true} items={panes} limit={10} />
      </argument>
    )
  }
}
Pane.extends = [PreferencePane]
