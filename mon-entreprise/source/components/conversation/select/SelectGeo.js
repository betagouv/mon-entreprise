import * as Animate from 'Components/ui/animate'
import React, { useCallback, useMemo, useState } from 'react'
import { Trans } from 'react-i18next'
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

export default function Select({ onChange, onSubmit, value }) {
	const [name, setName] = useState(value?.nom)
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
				onChange({
					...option,
					...(taux != undefined
						? {
								'taux du versement transport': taux
						  }
						: {})
				})
			})
			.catch(error => {
				//eslint-disable-next-line no-console
				console.log(
					'Erreur dans la récupération du taux de versement transport à partir du code commune',
					error
				) || onChange(option)
			})
			.finally(() => {
				onSubmit() // eslint-disable-line no-console
				setSearchResults(null)
				setName(option.nom)
			})
	}

	return (
		<div>
			<input
				type="search"
				className="ui__"
				value={name}
				// placeholder={t("Saisissez le nom d'une commune")}
				onChange={e => {
					setName(e.target.value)
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

			<Animate.fromTop>
				{searchResults &&
					searchResults.map(result => {
						const { nom, departement } = result
						return (
							<button
								onClick={() => submitOnChange(result)}
								key={nom + departement?.nom}
								css={`
									text-align: left;
									display: block;
									color: inherit;
									background-color: var(--lightestColor) !important;
									width: 100%;
									border-radius: 0.3rem;
									:hover,
									:focus {
										background-color: var(--lighterColor) !important;
									}
									background: white;
									transition: background-color 0.2s;
									width: 25rem;
									max-width: 100%;
									margin-bottom: 0.3rem;
									font-size: 100%;
									padding: 0.6rem;
								`}
							>
								{nom + ` (${departement?.nom})`}
							</button>
						)
					})}
			</Animate.fromTop>
		</div>
	)
}
