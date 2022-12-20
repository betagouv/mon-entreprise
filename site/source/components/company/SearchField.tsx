import { useSearchFieldState } from '@react-stately/searchfield'
import { ReactNode, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { ThemeProvider } from 'styled-components'

import { FabriqueSocialEntreprise } from '@/api/fabrique-social'
import { Message } from '@/design-system'
import { Card } from '@/design-system/card'
import { SearchField } from '@/design-system/field'
import { Grid } from '@/design-system/layout'
import { Strong } from '@/design-system/typography'
import { Body } from '@/design-system/typography/paragraphs'
import useSearchCompany from '@/hooks/useSearchCompany'

import { FromTop } from '../ui/animate'
import CompanySearchDetails from './SearchDetails'

const StyledCard = styled(Card)`
	flex-direction: row; // for Safari <= 13
`

export function CompanySearchField(props: {
	label?: ReactNode
	onValue?: () => void
	onClear?: () => void
	onSubmit?: (search: FabriqueSocialEntreprise | null) => void
	isDark?: boolean
}) {
	const { t } = useTranslation()
	const refResults = useRef<FabriqueSocialEntreprise[] | null>(null)

	const searchFieldProps = {
		...props,
		label: t('CompanySearchField.label', "Nom de l'entreprise, SIREN ou SIRET"),
		description: t(
			'CompanySearchField.description',
			'Le numéro Siret est un numéro de 14 chiffres unique pour chaque entreprise. Ex : 40123778000127'
		),
		onSubmit() {
			const results = refResults.current
			props.onSubmit?.(results?.[0] ?? null)
		},
		placeholder: t(
			'CompanySearchField.placeholder',
			'Ex : Café de la gare ou 40123778000127'
		),
	}

	const state = useSearchFieldState(searchFieldProps)

	const { onValue, onClear, onSubmit } = props
	useEffect(
		() => (!state.value ? onClear?.() : onValue?.()),
		[state.value, onValue, onClear]
	)

	const [searchPending, results] = useSearchCompany(state.value)

	useEffect(() => {
		refResults.current = results ?? null
	}, [results])

	return (
		<Grid container>
			<Grid item xs={12}>
				<ThemeProvider
					theme={(theme) => ({
						...theme,
						darkMode: props?.isDark ?? theme.darkMode,
					})}
				>
					<SearchField
						data-test-id="company-search-input"
						state={state}
						isSearchStalled={searchPending}
						onClear={onClear}
						{...searchFieldProps}
					/>
				</ThemeProvider>
			</Grid>
			<Grid item xs={12}>
				{state.value && !searchPending && (
					<Results results={results} onSubmit={onSubmit} />
				)}
			</Grid>
		</Grid>
	)
}

function Results({
	results,
	onSubmit,
}: {
	results: Array<FabriqueSocialEntreprise>
	onSubmit?: (établissement: FabriqueSocialEntreprise) => void
}) {
	return !results.length ? (
		<FromTop>
			<Message type="info" icon>
				<Body>
					<Strong>Aucune entreprise correspondante trouvée</Strong>
				</Body>
				<Body>
					Vous pouvez réessayer avec votre SIREN ou votre SIRET pour un meilleur
					résultat
				</Body>
			</Message>
		</FromTop>
	) : (
		<FromTop>
			<Grid container spacing={2} data-test-id="company-search-results">
				{results.map((etablissement) => (
					<Grid key={etablissement.siren} item xs={12}>
						<StyledCard
							bodyAs="div"
							onPress={() => onSubmit?.(etablissement)}
							compact
						>
							<CompanySearchDetails entreprise={etablissement} />
						</StyledCard>
					</Grid>
				))}
			</Grid>
		</FromTop>
	)
}
