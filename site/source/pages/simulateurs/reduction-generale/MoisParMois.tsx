import { useTranslation } from 'react-i18next'
import { styled } from 'styled-components'

import RuleLink from '@/components/RuleLink'
import { Spacing } from '@/design-system/layout'
import { baseTheme } from '@/design-system/theme'
import { H3 } from '@/design-system/typography/heading'
import { useMediaQuery } from '@/hooks/useMediaQuery'

import RécapitulatifTrimestre from './components/RécapitulatifTrimestre'
import RéductionGénéraleMois from './components/RéductionGénéraleMois'
import Warnings from './components/Warnings'
import { MonthState, Options, réductionGénéraleDottedName } from './utils'

type Props = {
	data: MonthState[]
	onRémunérationChange: (monthIndex: number, rémunérationBrute: number) => void
	onOptionsChange: (monthIndex: number, options: Options) => void
}

export default function RéductionGénéraleMoisParMois({
	data,
	onRémunérationChange,
	onOptionsChange,
}: Props) {
	const { t } = useTranslation()
	const isDesktop = useMediaQuery(
		`(min-width: ${baseTheme.breakpointsWidth.md})`
	)

	const months = [
		t('janvier'),
		t('février'),
		t('mars'),
		t('avril'),
		t('mai'),
		t('juin'),
		t('juillet'),
		t('août'),
		t('septembre'),
		t('octobre'),
		t('novembre'),
		t('décembre'),
	]

	const quarters = {
		[t('pages.simulateurs.réduction-générale.recap.T1', '1er trimestre')]:
			data.slice(0, 3),
		[t('pages.simulateurs.réduction-générale.recap.T2', '2ème trimestre')]:
			data.slice(3, 6),
		[t('pages.simulateurs.réduction-générale.recap.T3', '3ème trimestre')]:
			data.slice(6, 9),
		[t('pages.simulateurs.réduction-générale.recap.T4', '4ème trimestre')]:
			data.slice(9),
	}

	return (
		<>
			{isDesktop ? (
				<>
					<H3 as="h2">
						{t(
							'pages.simulateurs.réduction-générale.month-by-month.caption',
							'Réduction générale mois par mois :'
						)}
					</H3>
					<StyledTable>
						<caption className="sr-only">
							{t(
								'pages.simulateurs.réduction-générale.month-by-month.caption',
								'Réduction générale mois par mois :'
							)}
						</caption>
						<thead>
							<tr>
								<th scope="col">{t('Mois')}</th>
								<th scope="col">
									{/* TODO: remplacer par rémunérationBruteDottedName lorsque ... */}
									<RuleLink dottedName="salarié . rémunération . brut" />
								</th>
								<th scope="col">
									<RuleLink dottedName={réductionGénéraleDottedName} />
								</th>
								<th scope="col">
									<RuleLink dottedName="salarié . cotisations . exonérations . réduction générale . régularisation" />
								</th>
							</tr>
						</thead>
						<tbody>
							{data.length > 0 &&
								months.map((monthName, monthIndex) => (
									<RéductionGénéraleMois
										key={`month-${monthIndex}`}
										monthName={monthName}
										data={data[monthIndex]}
										index={monthIndex}
										onRémunérationChange={(
											monthIndex: number,
											rémunérationBrute: number
										) => {
											onRémunérationChange(monthIndex, rémunérationBrute)
										}}
										onOptionsChange={(monthIndex: number, options: Options) => {
											onOptionsChange(monthIndex, options)
										}}
									/>
								))}
						</tbody>
					</StyledTable>

					<Spacing md />

					<H3 as="h2">
						{t(
							'pages.simulateurs.réduction-générale.recap.caption',
							'Récapitulatif trimestriel :'
						)}
					</H3>
					<StyledRecapTable>
						<caption className="sr-only">
							{t(
								'pages.simulateurs.réduction-générale.recap.caption',
								'Récapitulatif trimestriel :'
							)}
						</caption>
						<thead>
							<tr>
								<th scope="col">{t('Trimestre')}</th>
								<th scope="col">
									{t(
										'pages.simulateurs.réduction-générale.recap.header',
										'Réduction calculée'
									)}
									<br />
									{t(
										'pages.simulateurs.réduction-générale.recap.code671',
										'code 671(€)'
									)}
								</th>
								<th scope="col">
									{t(
										'pages.simulateurs.réduction-générale.recap.header',
										'Réduction calculée'
									)}
									<br />
									{t(
										'pages.simulateurs.réduction-générale.recap.code801',
										'code 801(€)'
									)}
								</th>
							</tr>
						</thead>
						<tbody>
							{Object.keys(quarters).map((label, index) => (
								<RécapitulatifTrimestre
									key={index}
									label={label}
									data={quarters[label]}
								/>
							))}
						</tbody>
					</StyledRecapTable>
				</>
			) : (
				<>
					<H3 as="h2">
						{t(
							'pages.simulateurs.réduction-générale.month-by-month.caption',
							'Réduction générale mois par mois :'
						)}
					</H3>
					{data.length > 0 &&
						months.map((monthName, monthIndex) => (
							<RéductionGénéraleMois
								key={`month-${monthIndex}`}
								monthName={monthName}
								data={data[monthIndex]}
								index={monthIndex}
								onRémunérationChange={(
									monthIndex: number,
									rémunérationBrute: number
								) => {
									onRémunérationChange(monthIndex, rémunérationBrute)
								}}
								onOptionsChange={(monthIndex: number, options: Options) => {
									onOptionsChange(monthIndex, options)
								}}
								mobileVersion={true}
							/>
						))}

					<Spacing xxl />

					<H3 as="h2">
						{t(
							'pages.simulateurs.réduction-générale.recap.caption',
							'Récapitulatif trimestriel :'
						)}
					</H3>
					{Object.keys(quarters).map((label, index) => (
						<RécapitulatifTrimestre
							key={index}
							label={label}
							data={quarters[label]}
							mobileVersion={true}
						/>
					))}
				</>
			)}

			<span id="options-description" className="sr-only">
				{t(
					'pages.simulateurs.réduction-générale.options.description',
					"Ajoute des champs pour moduler l'activité du salarié"
				)}
			</span>

			<Warnings />
		</>
	)
}

const StyledTable = styled.table`
	border-collapse: collapse;
	text-align: left;
	width: 100%;
	color: ${({ theme }) => theme.colors.bases.primary[100]};
	font-family: ${({ theme }) => theme.fonts.main};
	caption {
		text-align: left;
		margin: ${({ theme }) => `${theme.spacings.sm} 0 `};
	}
	th,
	td {
		padding: ${({ theme }) => theme.spacings.xs};
	}
	tbody tr th {
		text-transform: capitalize;
		font-weight: normal;
	}
`
const StyledRecapTable = styled(StyledTable)`
	thead {
		border-bottom: solid 1px;
	}
	thead th:not(:last-of-type),
	tbody th,
	td:not(:last-of-type) {
		border-right: solid 1px;
	}
	thead th:not(:first-of-type) {
		text-align: center;
	}
`
