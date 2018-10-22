import React, { Component } from 'react'
import yaml from 'js-yaml'
import rules from 'Règles/base.yaml'
import emoji from 'react-easy-emoji'
import MonacoEditor from 'react-monaco-editor'
import { buildDottedName } from 'Engine/rules'

export default class Source extends Component {
	render() {
		let { dottedName } = this.props,
			source = rules.filter(rule => buildDottedName(rule).includes(dottedName))

		return (
			<div id="Source" className="ui__ container">
				<h2>
					{emoji('⛰️ ')}
					Source de <code>{dottedName}</code>
				</h2>
				<MonacoEditor
					height="800"
					width="1000"
					language={'yaml'}
					value={yaml.safeDump(source)}
				/>
			</div>
		)
	}
}
