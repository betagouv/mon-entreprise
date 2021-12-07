import { Grid } from '@mui/material'
import { useSearchFieldState } from '@react-stately/searchfield'
import { AriaSearchFieldProps } from '@react-types/searchfield'
import { Card } from 'DesignSystem/card'
import { SearchField } from 'DesignSystem/field'
import { Body, Intro } from 'DesignSystem/typography/paragraphs'
import useSearchCompany from 'Hooks/useSearchCompany'
import { ReactNode, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { Etablissement, searchDenominationOrSiren } from '../api/sirene'
import CompanyDetails from './CompanyDetails'
import { FromTop } from './ui/animate'

export function CompanySearchField(
	props: Omit<AriaSearchFieldProps, 'onSubmit'> & {
		label?: ReactNode
		onValue?: () => void
		onClear?: () => void
		onSubmit?: (établissement: Etablissement) => void
	}
) {
	const { t } = useTranslation()

	const searchFieldProps = {
		...props,
		label: t('CompanySearchField.label', "Nom de l'entreprise, SIREN ou SIRET"),
		description: t(
			'CompanySearchField.description',
			'Le numéro Siret est un numéro de 14 chiffres unique pour chaque entreprise. Ex : 40123778000127'
		),
		onSubmit(value: string) {
			searchDenominationOrSiren(value).then((result) => {
				if (!result || result.length !== 1) {
					return
				}
				props.onSubmit?.(result[0])
			})
		},
		placeholder: t(
			'CompanySearchField.placeholder',
			'Café de la gare ou 40123778000127'
		),
	}

	const state = useSearchFieldState(searchFieldProps)

	const { onValue = () => {}, onClear = () => {} } = props
	useEffect(
		() => (!state.value ? onClear() : onValue()),
		[state.value, onValue, onClear]
	)

	const [searchPending, results] = useSearchCompany(state.value)

	return (
		<Grid container>
			<Grid item xs={12}>
				<SearchField
					data-testid="company-search-input"
					state={state}
					isSearchStalled={searchPending}
					onClear={onClear}
					{...searchFieldProps}
				/>
			</Grid>
			<Grid item xs={12}>
				{state.value && !searchPending && (
					<Results results={results} onSubmit={props.onSubmit ?? (() => {})} />
				)}
			</Grid>
		</Grid>
	)
}

function Results({
	results,
	onSubmit,
}: {
	results: Array<Etablissement>
	onSubmit: (établissement: Etablissement) => void
}) {
	return !results.length ? (
		<FromTop>
			<MessageContainer>
				<Intro>Aucune entreprise correspondante trouvée</Intro>
				<Body>
					Vous pouvez réessayer avec votre SIREN ou votre SIRET pour un meilleur
					résultat
				</Body>
			</MessageContainer>
		</FromTop>
	) : (
		<FromTop>
			<Grid container spacing={2} data-testid="company-search-results">
				{results.map((etablissement) => (
					<Grid key={etablissement.siren} item xs={12} xl={6}>
						<Card onPress={() => onSubmit(etablissement)} compact>
							<CompanyDetails {...etablissement} />
						</Card>
					</Grid>
				))}
			</Grid>
		</FromTop>
	)
}

const MessageContainer = styled.div`
	display: flex;
	flex-direction: column;
	background: ${({ theme }) => theme.colors.bases.primary[500]};
	margin-top: 0.4rem;
	padding: 0.6rem 1rem 0;
	border-radius: 0.3rem;

	${Intro}, ${Body} {
		margin-top: 0;
	}
`
