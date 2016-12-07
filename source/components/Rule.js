import React, { Component } from 'react'
import {findRuleByName} from '../model.js'
import {safeDump} from 'js-yaml'
import './Rule.css'

export default class Rule extends Component {
	render() {
		return (
			<div id="variable">
				<pre>
					<code className="yaml">
						{safeDump(findRuleByName(this.props.params.name)[2])}
					</code>
				</pre>
			</div>

		)
	}
}
