import React, { Component } from 'react'
import {findRuleByName} from '../engine/rules.js'
import './Rule.css'
import JSONTree from 'react-json-tree'

export default class Rule extends Component {
	render() {
		let {
			name
		} = this.props.params,
			json = findRuleByName(name)

		return (
			<div id="variable">
				<h1>{name}</h1>
				<pre>
					<code className="yaml">
						<JSONTree getItemString={() => ''} theme={theme} hideRoot="true" shouldExpandNode={() => true} data={json} />
					</code>
				</pre>
			</div>

		)
	}
}



var theme =  {
	scheme: 'atelier forest',
	author: 'bram de haan (http://atelierbram.github.io/syntax-highlighting/atelier-schemes/forest)',
	base00: '#1b1918',
	base01: '#2c2421',
	base02: '#68615e',
	base03: '#766e6b',
	base04: '#9c9491',
	base05: '#a8a19f',
	base06: '#e6e2e0',
	base07: '#f1efee',
	base08: '#f22c40',
	base09: '#df5320',
	base0A: '#d5911a',
	base0B: '#5ab738',
	base0C: '#00ad9c',
	base0D: '#407ee7',
	base0E: '#6666ea',
	base0F: '#c33ff3'
}
