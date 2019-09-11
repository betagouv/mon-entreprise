import { buildDottedName } from 'Engine/rules'
import { safeDump } from 'js-yaml'
import React from 'react'
import emoji from 'react-easy-emoji'
import rules from 'Règles/base.yaml'
import ColoredYaml from './ColoredYaml'

export default function RuleSource({ dottedName }) {
	let source = rules.filter(rule => buildDottedName(rule).includes(dottedName))

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
