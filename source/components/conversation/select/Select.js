import React, { Component } from 'react'
import { FormDecorator } from '../FormDecorator'
import ReactSelect from 'react-select'

import 'react-select/dist/react-select.css'
import './Select.css'

let getOptions = input =>
	input.length < 3
		? Promise.resolve({ options: [] })
		: fetch(`https://geo.api.gouv.fr/communes?nom=${input}`)
				.then(response => {
					if (!response.ok)
						return [{ nom: 'Aucune commune trouvée', disabled: true }]
					return response.json()
				})
				.then(json => ({ options: json }))
				.catch(function(error) {
					console.log(
						'Erreur dans la recherche de communes à partir du code postal',
						error
					) // eslint-disable-line no-console
					return { options: [] }
				})

@FormDecorator('select')
export default class Select extends Component {
	render() {
		let { input: { onChange }, submit, suggestions } = this.props,
			submitOnChange = option => {
				onChange(option.code)
				submit()
			}

		return (
			<div className="select-answer commune">
				<ReactSelect.Async
					onChange={submitOnChange}
					labelKey="nom"
					optionRenderer={({ nom, codeDepartement }) =>
						nom + ` (${codeDepartement})`
					}
					placeholder="Entrez le nom de commune"
					noResultsText="Nous n'avons trouvé aucune commune"
					searchPromptText={null}
					loadingPlaceholder="Recherche en cours..."
					loadOptions={getOptions}
				/>
			</div>
		)
	}
}
