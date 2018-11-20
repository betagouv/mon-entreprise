import React, { Component, Suspense } from 'react'
import yaml from 'js-yaml'
import rules from 'Règles/base.yaml'
import emoji from 'react-easy-emoji'
import { buildDottedName } from 'Engine/rules'

let ColoredYaml = React.lazy(() => import('./ColoredYaml'))

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
				<Suspense fallback={<div>Chargement du code source...</div>}>
					<ColoredYaml source={yaml.safeDump(source)} />
				</Suspense>
			</div>
		)
	}
}
