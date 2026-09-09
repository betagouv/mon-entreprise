import { useSearchFieldState } from '@react-stately/searchfield'
import { ReactNode, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'

import { Grid, SearchableSelectField } from '@/design-system'
import { Entreprise } from '@/domaine/Entreprise'
import useSearchCompany from '@/hooks/useSearchCompany'

import { Appear } from '../ui/animate'
import EntrepriseSearchResults from './EntrepriseSearchResults'

export function EntrepriseSearchField(props: {
	label?: ReactNode
	selectedValue?: ReactNode | null
	onValue?: () => void
	onClear?: () => void
	onSubmit?: (search: Entreprise | null) => void
}) {
	const { t } = useTranslation()
	const refResults = useRef<Entreprise[] | null>(null)

	const searchFieldProps = {
		...props,
		label:
			!props.selectedValue &&
			t('EntrepriseSearchField.label', "Nom de l'entreprise, SIREN ou SIRET"),
		description:
			!props.selectedValue &&
			t(
				'EntrepriseSearchField.description',
				'Le numéro Siret est un numéro de 14 chiffres unique pour chaque entreprise. Exemple : 40123778000127'
			),
		onSubmit() {
			const results = refResults.current
			props.onSubmit?.(results?.[0] ?? null)
		},
		onClear() {
			props.onClear?.()
		},
		placeholder: t(
			'EntrepriseSearchField.placeholder',
			'Exemple : Café de la gare ou 40123778000127'
		),
	}

	const state = useSearchFieldState(searchFieldProps)

	const { onSubmit } = props

	const [searchPending, results] = useSearchCompany(state.value)

	useEffect(() => {
		refResults.current = results ?? null
	}, [results])

	return (
		<Grid container>
			<Grid item xs={12}>
				<SearchableSelectField
					data-test-id="company-search-input"
					state={state}
					isSearchStalled={searchPending}
					aria-label={`${searchFieldProps.label}, ${t(
						"recherche lancée automatiquement après l'entrée de caractères, les résultats s'afficheront à la suite de cet élément."
					)}`}
					{...searchFieldProps}
				/>
			</Grid>

			<Grid item xs={12}>
				<Appear unless={searchPending || !state.value}>
					{state.value && !searchPending && !props.selectedValue && (
						<EntrepriseSearchResults results={results} onSubmit={onSubmit} />
					)}
				</Appear>
			</Grid>
		</Grid>
	)
}
