import React, { Component } from 'react'
import ReactSelect from 'react-select'
import 'react-select/dist/react-select.css'
import { FormDecorator } from '../FormDecorator'
import './Select.css'

const tauxVersementTransport = codeCommune => {
	return fetch(
		'https://versement-transport.netlify.com/.netlify/functions/taux-par-code-commune?codeCommune=' +
			codeCommune,
		{
			method: 'GET'
		}
	).then(response => response.json())
}

let getOptions = input =>
	input.length < 3
		? Promise.resolve({ options: [] })
		: fetch(
				`https://geo.api.gouv.fr/communes?nom=${input}&fields=nom,code,departement,region&boost=population`
		  )
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

export default FormDecorator('select')(
	class Select extends Component {
		render() {
			let {
					input: { onChange },
					submit
				} = this.props,
				submitOnChange = option => {
					tauxVersementTransport(option.code)
						.then(({ taux }) => {
							// serialize to not mix our data schema and the API response's
							onChange(
								JSON.stringify({
									...option,
									...(taux != undefined
										? {
												'taux du versement transport': taux
										  }
										: {})
								})
							)
							submit()
						})
						.catch(error => {
							//eslint-disable-next-line no-console
							console.log(
								'Erreur dans la récupération du taux de versement transport à partir du code commune',
								error
							) || onChange(JSON.stringify({ option }))
							submit() // eslint-disable-line no-console
						})
				}

			return (
				<div className="select-answer commune">
					<ReactSelect.Async
						onChange={submitOnChange}
						labelKey="nom"
						optionRenderer={({ nom, departement }) =>
							nom + ` (${departement?.nom})`
						}
						filterOptions={options => {
							// Do no filtering, just return all options
							return options
						}}
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
)
