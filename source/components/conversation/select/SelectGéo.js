import { T } from 'Components'
import React, { useCallback, useMemo, useState } from 'react'
import { debounce } from '../../../utils'
import { FormDecorator } from '../FormDecorator'

async function tauxVersementTransport(codeCommune) {
	const response = await fetch(
		'https://versement-transport.netlify.com/.netlify/functions/taux-par-code-commune?codeCommune=' +
			codeCommune
	)
	if (!response.ok) {
		return null
	}
	const json = await response.json()
	return json
}

async function searchCommunes(input) {
	const response = await fetch(
		`https://geo.api.gouv.fr/communes?nom=${input}&fields=nom,code,departement,region&boost=population`
	)
	if (!response.ok) {
		return null
	}
	const json = await response.json()
	return json
}

export default FormDecorator('select')(function Select({
	setFormValue,
	submit
}) {
	const [searchResults, setSearchResults] = useState()
	const [isLoading, setLoadingState] = useState(false)

	const handleSearch = useCallback(
		function(value) {
			searchCommunes(value).then(results => {
				setLoadingState(false)
				setSearchResults(results)
			})
		},
		[setSearchResults, setLoadingState]
	)
	const debouncedHandleSearch = useMemo(() => debounce(300, handleSearch), [
		handleSearch
	])

	let submitOnChange = option => {
		tauxVersementTransport(option.code)
			.then(({ taux }) => {
				// serialize to not mix our data schema and the API response's
				setFormValue(
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
				) || setFormValue(JSON.stringify({ option }))
				submit() // eslint-disable-line no-console
			})
	}

	return (
		<>
			<input
				type="search"
				css={`
					padding: 0.4rem;
					margin: 0.2rem 0;
					width: 100%;
					border: 1px solid var(--lighterTextColor);
					border-radius: 0.3rem;
					color: inherit;
					font-size: inherit;
					transition: border-color 0.1s;
					position: relative;

					:focus {
						border-color: var(--color);
					}
				`}
				placeholder="Saisissez le nom d'une commune"
				onChange={e => {
					if (e.target.value.length < 2) {
						setSearchResults(undefined)
						return
					}
					setLoadingState(true)
					debouncedHandleSearch(e.target.value)
				}}
			/>
			{!isLoading && (searchResults && searchResults.length === 0) && (
				<p>
					<T>Aucun résultat</T>
				</p>
			)}

			{searchResults &&
				searchResults.map(result => {
					const { nom, departement } = result
					return (
						<button
							onClick={() => submitOnChange(result)}
							key={nom + departement?.nom}
							css={`
								text-align: left;
								width: 100%;
								padding: 0 0.4rem;
								border-radius: 0.3rem;
								:hover,
								:focus {
									background-color: var(--lighterColor);
								}
								background: white;
								border-radius: 0.6remv;
								margin-bottom: 0.3rem;
								font-size: 100%;
								padding: 0.6rem;
								color: inherit;
								margin-right: 2rem;
							`}
						>
							{nom + ` (${departement?.nom})`}
						</button>
					)
				})}
		</>
	)
})
