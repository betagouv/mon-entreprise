import { setEntreprise } from 'Actions/existingCompanyActions'
import { React, T } from 'Components'
import CompanyDetails from 'Components/CompanyDetails'
import { useCallback, useMemo, useState } from 'react'
import { useDispatch } from 'react-redux'
// $FlowFixMe
import 'react-select/dist/react-select.css'
import { searchDenominationOrSiren } from '../api/sirene'
import { debounce } from '../utils'

export default function Search() {
	const [searchResults, setSearchResults] = useState()
	const [isLoading, setLoadingState] = useState(false)

	const handleSearch = useCallback(
		function(value) {
			searchDenominationOrSiren(value).then(results => {
				setLoadingState(false)
				setSearchResults(results)
			})
		},
		[setSearchResults, setLoadingState]
	)
	const debouncedHandleSearch = useMemo(() => debounce(300, handleSearch), [
		handleSearch
	])
	const dispatch = useDispatch()
	return (
		<>
			<h1 className="question__title">
				<T k="trouver.titre">Retrouver mon entreprise</T>
			</h1>
			<p>
				<T k="trouver.description">
					Grâce à la base SIREN, les données publiques sur votre entreprise
					seront automatiquement disponibles pour la suite du parcours sur le
					site.
				</T>
			</p>
			<label className="ui__ notice">
				<T>Nom de l'entreprise ou SIREN </T>:{' '}
			</label>
			<br />
			<input
				type="search"
				css={`
					padding: 0.4rem;
					margin: 0.2rem 0;
					width: 100%;
					border: 1px solid var(--lighterTextColour);
					border-radius: 0.3rem;
					color: inherit;
					font-size: inherit;
					transition: border-color 0.1s;
					position: relative;

					:focus {
						border-color: var(--colour);
					}
				`}
				onChange={e => {
					if (e.target.value.length < 2) {
						setSearchResults(undefined)
						return
					}
					setLoadingState(true)
					debouncedHandleSearch(e.target.value)
				}}
			/>
			{!isLoading && searchResults === null && <p>Aucun résultat</p>}

			{searchResults &&
				searchResults.map(({ siren, denomination }) => (
					<button
						onClick={() => dispatch(setEntreprise(siren))}
						key={siren}
						css={`
							text-align: left;
							width: 100%;
							padding: 0.4rem;
							border-radius: 0.3rem;
							:hover,
							:focus {
								background-color: var(--lighterColour);
							}
						`}>
						<CompanyDetails siren={siren} denomination={denomination} />
					</button>
				))}
		</>
	)
}
