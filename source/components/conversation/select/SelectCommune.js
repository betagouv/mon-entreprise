import React, { Component } from 'react'
import { FormDecorator } from './FormDecorator'
import ReactSelect from 'react-select'
import 'react-select/dist/react-select.css'
import './Select.css'

let getOptions = input =>
	input.length !== 5
		? Promise.resolve({})
		: fetch(`https://apicarto.sgmap.fr/codes-postaux/communes/${input}`)
				.then(response => {
					if (!response.ok)
						return [{ nomCommune: 'Aucune commune trouvée', disabled: true }]
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
export default class SelectCommune extends Component {
	render() {
		let { input: { onChange }, submit } = this.props,
			submitOnChange = option => {
				onChange(option)
				submit()
			}

		return (
			<div className="select-answer commune">
				<ReactSelect.Async
					onChange={submitOnChange}
					labelKey="codePostal"
					optionRenderer={({ nomCommune }) => nomCommune}
					valueKey="codeInsee"
					placeholder="Entrez votre code postal"
					noResultsText="Nous n'avons trouvé aucune commune"
					searchPromptText={null}
					loadingPlaceholder="Recherche en cours..."
					loadOptions={getOptions}
				/>
			</div>
		)
	}
}
