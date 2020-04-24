import React, { useCallback, useMemo, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { debounce } from '../../../utils'

async function tauxVersementTransport(codeCommune) {
	const response = await fetch(
		'https://versement-transport.netlify.app/.netlify/functions/taux-par-code-commune?codeCommune=' +
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

export default function Select({ onChange, onSubmit }) {
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
	const { t } = useTranslation()

	let submitOnChange = option => {
		tauxVersementTransport(option.code)
			.then(({ taux }) => {
				// serialize to not mix our data schema and the API response's
				onChange({
					...option,
					...(taux != undefined
						? {
								'taux du versement transport': taux
						  }
						: {})
				})
				onSubmit()
			})
			.catch(error => {
				//eslint-disable-next-line no-console
				console.log(
					'Erreur dans la récupération du taux de versement transport à partir du code commune',
					error
				) || onChange(option)
				onSubmit() // eslint-disable-line no-console
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
				placeholder={t("Saisissez le nom d'une commune")}
				onChange={e => {
					if (e.target.value.length < 2) {
						setSearchResults(undefined)
						return
					}
					setLoadingState(true)
					debouncedHandleSearch(e.target.value)
				}}
			/>
			{!isLoading && searchResults && searchResults.length === 0 && (
				<p>
					<Trans>Aucun résultat</Trans>
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
}
