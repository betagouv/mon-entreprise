import React, { Component } from 'react'
import { safeDump } from 'js-yaml'
import rules from 'Règles/base.yaml'
import emoji from 'react-easy-emoji'
import { buildDottedName } from 'Engine/rules'
import ColoredYaml from './ColoredYaml'

export default class RuleSource extends Component {
	render() {
		let { dottedName } = this.props,
			source = rules.filter(rule => buildDottedName(rule).includes(dottedName))

		return (
			<div id="RuleSource" className="ui__ container">
				<h2>
					{emoji('⚙️ ')}
					Code source <br />
					<code>{dottedName}</code>
				</h2>
				<ColoredYaml source={safeDump(source)} />
			</div>
		)
	}
}
