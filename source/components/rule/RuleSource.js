import React, { Component, Suspense } from 'react'
import { safeDump, safeLoad } from 'js-yaml'
import emoji from 'react-easy-emoji'
import { buildDottedName } from 'Engine/rules'
import { partition } from 'ramda'

let MonacoEditor = React.lazy(() => import('react-monaco-editor'))

export default class Source extends Component {
	constructor(props) {
		super(props)
		let { dottedName } = this.props,
			[rulesNotInScope, rulesInScope] = partition(rule =>
				buildDottedName(rule).includes(dottedName)
			)(window.rawRules)

		this.rulesNotInScope = rulesNotInScope
		this.state = {
			code: safeDump(rulesInScope),
			PR: null
		}
	}
	submit = () => {
		let code = this.refs.monaco.editor.getValue(),
			newRulesInScope = safeLoad(code),
			newRules = this.rulesNotInScope.concat(newRulesInScope)

		let body = JSON.stringify({
			user: 'laem',
			repo: 'publi.codes',
			description: "Ceci est une contribution d'un utilisateur",
			title: '🔨 Mise à jour des règles',
			commit: '🔨 Commit unique',
			files: [
				{
					path: 'co2.yaml',
					content: safeDump(newRules)
				}
			]
		})

		let fetchParams = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json; charset=utf-8',
				'cache-control': 'no-cache'
			},
			body
		}
		console.log({ body })
		fetch('http://localhost:3000', fetchParams)
			.then(response => response.json())
			.then(json => this.setState({ PR: json }))
	}
	render() {
		return (
			<div id="Source" className="ui__ container">
				<h2>
					{emoji('⚙️ ')}
					Code source <br />
					<code>{this.props.dottedName}</code>
				</h2>
				<Suspense fallback={<div>Chargement du code source...</div>}>
					<MonacoEditor
						ref="monaco"
						height="800"
						width="1000"
						language={'yaml'}
						value={this.state.code}
						onChange={this.onChange}
					/>
					<button onClick={this.submit}>Soumettre mes changements</button>
				</Suspense>
				{this.state.PR && <div>{JSON.stringify(this.state.PR)}</div>}
			</div>
		)
	}
}
