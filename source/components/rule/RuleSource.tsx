import { safeDump } from 'js-yaml'
import React from 'react'
import emoji from 'react-easy-emoji'
import { useSelector } from 'react-redux'
import { flatRulesSelector } from 'Selectors/analyseSelectors'
import ColoredYaml from './ColoredYaml'

type RuleSourceProps = Pick<Rule, 'dottedName'>

export default function RuleSource({ dottedName }: RuleSourceProps) {
	let rules = useSelector(flatRulesSelector)
	let source = rules[dottedName]

		return (
			<div
				id="RuleSource"
				className="ui__ container"
				css={`
					pre {
						border-radius: 0.6rem;
					}
				`}>
				<h2>
					{emoji('⚙️ ')}
					Code source <br />
					<code>{dottedName}</code>
				</h2>
				<ColoredYaml source={safeDump(source)} />
			</div>
		)
	}
)
