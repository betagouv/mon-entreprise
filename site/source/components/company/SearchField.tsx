import { useSearchFieldState } from '@react-stately/searchfield'
import { ReactNode, useEffect, useRef } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { styled } from 'styled-components'

import { ForceThemeProvider } from '@/components/utils/DarkModeContext'
import { Message } from '@/design-system'
import { Card } from '@/design-system/card'
import { SearchableSelectField } from '@/design-system/field/SearchableSelectField/SearchableSelectField'
import { FocusStyle } from '@/design-system/global-style'
import { ChevronIcon } from '@/design-system/icons'
import { Grid } from '@/design-system/layout'
import { Strong } from '@/design-system/typography'
import { StyledLink } from '@/design-system/typography/link'
import { Li, Ul } from '@/design-system/typography/list'
import { Body } from '@/design-system/typography/paragraphs'
import { Entreprise } from '@/domain/Entreprise'
import useSearchCompany from '@/hooks/useSearchCompany'

import { Appear, FromTop } from '../ui/animate'
import EntrepriseSearchDetails from './SearchDetails'

const StyledCard = styled(Card)`
	flex-direction: row; // for Safari <= 13
	cursor: pointer;
	&:focus-visible {
		${FocusStyle}
	}
`

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
			t('CompanySearchField.label', "Nom de l'entreprise, SIREN ou SIRET"),
		description:
			!props.selectedValue &&
			t(
				'CompanySearchField.description',
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
			'CompanySearchField.placeholder',
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
					aria-label={
						searchFieldProps.label +
						', ' +
						t(
							"recherche lancée automatiquement après l'entrée de caractères, les résultats s'afficheront à la suite de cet élément."
						)
					}
					{...searchFieldProps}
				/>
			</Grid>

			<Grid item xs={12}>
				<Appear unless={searchPending || !state.value}>
					{state.value && !searchPending && !props.selectedValue && (
						<Results results={results} onSubmit={onSubmit} />
					)}
				</Appear>
			</Grid>
		</Grid>
	)
}

function Results({
	results,
	onSubmit,
}: {
	results: Array<Entreprise>
	onSubmit?: (entreprise: Entreprise) => void
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
							consulter et utiliser nos simulateurs.
						</Body>
					</Trans>
				</Body>
			</Message>
		</FromTop>
	) : (
		<FromTop>
			<ForceThemeProvider>
				<Ul noMarker data-test-id="company-search-results">
					{results.map((entreprise) => (
						<Li key={entreprise.siren}>
							<StyledCard
								onPress={() => onSubmit?.(entreprise)}
								onClick={() => onSubmit?.(entreprise)}
								compact
								bodyAs="div"
								aria-label={`${entreprise.nom}, Selectionner cette entreprise`}
								ctaLabel={
									<ChevronIcon
										style={{
											height: '20px',
											marginTop: '5px',
										}}
										aria-hidden
									/>
								}
							>
								<EntrepriseSearchDetails entreprise={entreprise} />
							</StyledCard>
						</Li>
					))}
				</Ul>
			</ForceThemeProvider>
		</FromTop>
	)
}
