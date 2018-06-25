/* @flow */
import React from 'react'
import * as Animate from '../animate'
import { SkipButton } from '../ui/Button'
import ReactSelect from 'react-select'
import 'react-select/dist/react-select.css'

export default function Create() {
	return (
		<Animate.fromBottom>
			<header className="ui__inverted-colors" style={{ textAlign: 'center' }}>
				<h1 className="question__title">Find your company</h1>
				<a className="ui__link-button" href="/steps/-create-my-company">
					I don't have a company yet
				</a>
			</header>
			<Search />
			<SkipButton />
		</Animate.fromBottom>
	)
}

class Search extends React.Component {
	state = {
		input: '',
		chosen: null
	}
	handleChange = input => {
		console.log({ input })
		this.setState({ input })
	}
	getOptions = input =>
		input.length < 3
			? Promise.resolve({ options: [] })
			: fetch(`https://sirene.entreprise.api.gouv.fr/v1/full_text/${input}`)
					.then(response => {
						if (!response.ok) console.log('not ok')
						return response.json()
					})
					.then(json => ({ options: json.etablissement }))
					.catch(function(error) {
						console.log(
							'Erreur dans la recherche de communes à partir du code postal',
							error
						) // eslint-disable-line no-console
					})
	//	componentDidMount() {
	//this.inputElement.focus()
	//}
	render() {
		if (this.state.chosen) return <Company {...this.state.input} />
		return (
			<>
				<ReactSelect.Async
					valueKey="id"
					labelKey="l1_normalisee"
					value={this.state.input}
					onChange={this.handleChange}
					optionRenderer={({ l1_normalisee, code_postal }) =>
						l1_normalisee + ` (${code_postal})`
					}
					placeholder="Nom d'entreprise (+ code postal)"
					noResultsText="Nous n'avons trouvé aucune entreprise..."
					searchPromptText={null}
					loadingPlaceholder="Recherche en cours..."
					loadOptions={this.getOptions}
				/>

				<button
					onClick={() => this.setState({ chosen: true })}
					className="ui__button">
					Okay
				</button>
			</>
		)
	}
}

let Company = ({ l1_normalisee, l4_normalisee, activite_principale }) => (
	<div>{l1_normalisee + ' ' + activite_principale}</div>
)
