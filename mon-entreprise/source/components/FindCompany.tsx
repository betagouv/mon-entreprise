import { useSetEntreprise } from 'Actions/companyStatusActions'
import CompanyDetails from 'Components/CompanyDetails'
import { TextField } from 'DesignSystem/field'
import { Body } from 'DesignSystem/typography/paragraphs'
import { useCallback, useMemo, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { Etablissement, searchDenominationOrSiren } from '../api/sirene'
import { debounce } from '../utils'

export default function Search() {
	const [searchResults, setSearchResults] =
		useState<Array<Etablissement> | null>()
	const [isLoading, setLoadingState] = useState(false)
	const { t } = useTranslation()
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
			<Body>
				<Trans i18nKey="trouver.description">
					Grâce à la base SIREN, les données publiques sur votre entreprise
					seront automatiquement disponibles pour la suite du parcours sur le
					site.
				</Trans>
			</Body>
			<TextField
				label={t("Nom de l'entreprise ou SIREN")}
				type="search"
				onChange={(value) => {
					if (value.length < 2) {
						setSearchResults(undefined)
						return
					}
					setLoadingState(true)
					debouncedHandleSearch(value)
				}}
			/>
			{!isLoading && searchResults === null && (
				<Body>
					<Trans>Aucun résultat</Trans>
				</Body>
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
