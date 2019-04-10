import { buildDottedName } from 'Engine/rules'
import React from 'react'
import { safeDump } from 'js-yaml'
import emoji from 'react-easy-emoji'
import ColoredYaml from './ColoredYaml'
import { connect } from 'react-redux'

export default connect(state => ({ rules: state.rules }))(
	({ rules, dottedName }) => {
		let source = rules.filter(rule =>
			buildDottedName(rule).includes(dottedName)
		)

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
)
