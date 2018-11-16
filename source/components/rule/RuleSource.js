import React, { Component, Suspense } from 'react'
import yaml from 'js-yaml'
import rules from 'Règles/base.yaml'
import emoji from 'react-easy-emoji'
import { buildDottedName } from 'Engine/rules'

let MonacoEditor = React.lazy(() => import('react-monaco-editor'))

export default class Source extends Component {
	render() {
		let { dottedName } = this.props,
			source = rules.filter(rule => buildDottedName(rule).includes(dottedName))

		return (
			<div id="Source" className="ui__ container">
				<h2>
					{emoji('⚙️ ')}
					Code source <br />
					<code>{dottedName}</code>
				</h2>
				<Suspense fallback={<div>Chargement du code source...</div>}>
					<MonacoEditor
						height="800"
						width="1000"
						language={'yaml'}
						value={yaml.safeDump(source)}
					/>
				</Suspense>
			</div>
		)
	}
}
