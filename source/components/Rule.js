import React, { Component } from 'react'
import {findRuleByName} from '../model.js'
import './Rule.css'
import JSONTree from 'react-json-tree'

export default class Rule extends Component {
	render() {
		let json = findRuleByName(this.props.params.name)[2]

		return (
			<div id="variable">
				<pre>
					<code className="yaml">
						<JSONTree hideRoot="true" shouldExpandNode={() => true} data={json} />
					</code>
				</pre>
			</div>

		)
	}
}
