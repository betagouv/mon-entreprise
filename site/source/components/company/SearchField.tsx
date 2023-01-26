import { useSearchFieldState } from '@react-stately/searchfield'
import { ReactNode, useEffect, useRef } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { FabriqueSocialEntreprise } from '@/api/fabrique-social'
import { ForceThemeProvider, ThemeType } from '@/contexts/DarkModeContext'
import { Message } from '@/design-system'
import { Card } from '@/design-system/card'
import { Emoji } from '@/design-system/emoji'
import { SearchField } from '@/design-system/field'
import { Grid } from '@/design-system/layout'
import { Strong } from '@/design-system/typography'
import { StyledLink } from '@/design-system/typography/link'
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
	forceTheme?: ThemeType
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
				<ForceThemeProvider forceTheme={props?.forceTheme}>
					<SearchField
						data-test-id="company-search-input"
						state={state}
						isSearchStalled={searchPending}
						onClear={onClear}
						{...searchFieldProps}
					/>
				</ForceThemeProvider>
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
	const { t } = useTranslation()

	return !results.length ? (
		<FromTop>
			<Message type="info" icon>
				<Body>
					<Strong>
						<Trans>
							Nous n’avons pas trouvé de résultat pour cette entreprise.
						</Trans>
					</Strong>
				</Body>
				<Body>
					<Trans>
						Vous pouvez réessayer avec votre SIREN ou votre SIRET pour un
						meilleur résultat.
					</Trans>
				</Body>
				<Body>
					<Trans>
						Si votre entreprise n'apparait pas en utilisant votre SIREN/SIRET,
						il se peut que vous ayez opté pour que{' '}
						<Strong>
							les informations de votre entreprise ne soient pas rendues
							publiques
						</Strong>
						, auquel cas elle n'apparaitra pas dans les résultats de recherche.
						Vous pouvez le vérifier sur{' '}
						<StyledLink
							aria-label={t("l'annuaire des entreprises, nouvelle fenêtre")}
							href="https://annuaire-entreprises.data.gouv.fr/"
						>
							l'annuaire des entreprises
						</StyledLink>
						.
						<Body>
							Si tel est le cas, pas d'inquiétude, vous pouvez tout de même
							consulter et utiliser nos simulateurs ci-dessous.{' '}
							<Emoji emoji="👇" />
						</Body>
					</Trans>
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
