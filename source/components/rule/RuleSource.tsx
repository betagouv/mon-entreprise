import { ParsedRule } from 'Engine/types'
import { safeDump } from 'js-yaml'
import rules from 'Publicode/rules'
import React from 'react'
import emoji from 'react-easy-emoji'
import PublicodeHighlighter from '../ui/PublicodeHighlighter'

type RuleSourceProps = Pick<ParsedRule, 'dottedName'>

export default function RuleSource({ dottedName }: RuleSourceProps) {
	let source = rules[dottedName]

	return (
		<div id="RuleSource" className="ui__ container">
			<h2>
				{emoji('⚙️ ')}
				Code source <br />
				<code>{dottedName}</code>
			</h2>
			<PublicodeHighlighter source={safeDump({ dottedName: source })} />
		</div>
	)
}
