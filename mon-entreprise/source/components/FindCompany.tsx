import { useSetEntreprise } from 'Actions/companyStatusActions'
import CompanyDetails from 'Components/CompanyDetails'
import { useCallback, useMemo, useState } from 'react'
import { Trans } from 'react-i18next'
import { Etablissement, searchDenominationOrSiren } from '../api/sirene'
import { debounce } from '../utils'

export default function Search() {
	const [searchResults, setSearchResults] =
		useState<Array<Etablissement> | null>()
	const [isLoading, setLoadingState] = useState(false)

	const handleSearch = useCallback(
		function (value) {
			searchDenominationOrSiren(value).then((results) => {
				setLoadingState(false)
				setSearchResults(results)
			})
		},
		[setSearchResults, setLoadingState]
	)
	const debouncedHandleSearch = useMemo(
		() => debounce(300, handleSearch),
		[handleSearch]
	)
	const setEntreprise = useSetEntreprise()

	return (
		<>
			<h1>
				<Trans i18nKey="trouver.titre">Retrouver mon entreprise</Trans>
			</h1>
			<p>
				<Trans i18nKey="trouver.description">
					Grâce à la base SIREN, les données publiques sur votre entreprise
					seront automatiquement disponibles pour la suite du parcours sur le
					site.
				</Trans>
			</p>
			<label className="ui__ notice">
				<Trans>Nom de l'entreprise ou SIREN </Trans>:{' '}
			</label>
			<br />
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
				onChange={(e) => {
					if (e.target.value.length < 2) {
						setSearchResults(undefined)
						return
					}
					setLoadingState(true)
					debouncedHandleSearch(e.target.value)
				}}
			/>
			{!isLoading && searchResults === null && (
				<p>
					<Trans>Aucun résultat</Trans>
				</p>
			)}

			{searchResults &&
				searchResults.map(({ siren, denomination }) => (
					<button
						onClick={() => setEntreprise(siren)}
						key={siren}
						css={`
							text-align: left;
							width: 100%;
							padding: 0 0.4rem;
							border-radius: 0.3rem;
							:hover,
							:focus {
								background-color: var(--lighterColor);
							}
						`}
					>
						<CompanyDetails siren={siren} denomination={denomination} />
					</button>
				))}
		</>
	)
}
