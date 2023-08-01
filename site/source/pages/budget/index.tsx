import { formatValue } from 'publicodes'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { TrackPage } from '@/components/ATInternetTracking'
import MoreInfosOnUs from '@/components/MoreInfosOnUs'
import { Markdown } from '@/components/utils/markdown'
import { ScrollToTop } from '@/components/utils/Scroll'
import { Item } from '@/design-system'
import { Emoji } from '@/design-system/emoji'
import { Select } from '@/design-system/field/Select'
import { Grid } from '@/design-system/layout'
import { H1, H2 } from '@/design-system/typography/heading'
import { Body } from '@/design-system/typography/paragraphs'

import Meta from '../../components/utils/Meta'
import prose from './budget.md?raw'
import budget from './budget.yaml'

// Splitting the markdown file to insert React components in-between is a bit
// arcane, we may consider MDX in the future https://github.com/mdx-js/mdx.
const [
	intro,
	ressources2019,
	ressources2020,
	ressources2021,
	ressources2022,
	ressourcesDescription,
] = prose.split(/\r?\n-{3,}\r?\n/)

const ressources = {
	2019: ressources2019,
	2020: ressources2020,
	2021: ressources2021,
	2022: ressources2022,
} as const

const arraySum = (arr: number[]) => arr.reduce((a, b) => a + b, 0)

export default function Budget() {
	const years = ['2019', '2020', '2021', '2022'] as const
	const quarters = [
		{ label: 'T1', 'aria-label': 'Trimestre 1' },
		{ label: 'T2', 'aria-label': 'Trimestre 2' },
		{ label: 'T3', 'aria-label': 'Trimestre 3' },
		{ label: 'T4', 'aria-label': 'Trimestre 4' },
	]
	const [selectedYear, setSelectedYear] = useState<(typeof years)[number]>(
		years[years.length - 1]
	)
	const categories = [
		...new Set(
			quarters
				.map((q) => Object.keys(budget[selectedYear]?.[q.label] ?? {}))
				.reduce((acc, curr) => [...acc, ...curr], [])
		),
	]
	const { t, i18n } = useTranslation()

	const { language } = i18n

	return (
		<>
			<TrackPage chapter1="informations" name="budget" />
			<Meta
				title={t('budget.title', 'Budget')}
				description={t('budget.description', 'Le budget de mon-entreprise')}
			/>
			<ScrollToTop />
			<H1>
				Budget <Emoji emoji="💶" />
			</H1>
			<Markdown>{intro}</Markdown>
			<H2>Budget consommé</H2>
			<Grid container>
				<Grid item xs={8} sm={3} lg={2}>
					<Select
						label={'Année'}
						defaultSelectedKey={selectedYear}
						onSelectionChange={(year) => {
							setSelectedYear(year as (typeof years)[number])
						}}
					>
						{years
							.filter((year) => !!year)
							.map((year) => (
								<Item key={year} textValue={year}>
									{year}
								</Item>
							))}
					</Select>
				</Grid>
			</Grid>

			<Body as="div">
				<Markdown>{ressources[selectedYear]}</Markdown>
			</Body>
			{selectedYear !== '2019' && (
				<>
					<div
						css={`
							overflow-x: auto;
						`}
					>
						<RessourcesAllocationTable role="table">
							<caption className="sr-only">
								{t(
									'budget.tableCaption',
									"Tableau affichant le bugdet de l'année {{year}} par poste de dépenses. La première colonne affiche l'année en cours ({{year}}) sur la première ligne puis les postes de dépenses et pour finir le total HT et total TTC. Les autres colonnes affichent les dépenses pour chaque trimestre. La dernière colonne affiche les totaux pour chaque poste de dépenses ainsi que les totaux HT et TTC agrégés.",
									{ year: selectedYear }
								)}
							</caption>
							<thead>
								<tr>
									<th>{selectedYear}</th>
									{quarters.map((q) => (
										<th scope="col" key={q.label} aria-label={q['aria-label']}>
											{q.label}
										</th>
									))}
									<th>Total</th>
								</tr>
							</thead>
							<tbody>
								{categories.map((label) => (
									<tr key={label}>
										<th scope="row">{label}</th>
										{quarters.map((q) => {
											const value = budget[selectedYear]?.[q.label]?.[label]

											return (
												<td key={q.label}>
													{value ? (
														formatValue(value, {
															displayedUnit: '€',
															language,
														})
													) : (
														<span aria-label="Pas de budget alloué">-</span>
													)}
												</td>
											)
										})}
										<td>
											{formatValue(
												arraySum(
													quarters.map(
														(q) => budget[selectedYear]?.[q.label]?.[label] ?? 0
													)
												),
												{
													displayedUnit: '€',
													language,
												}
											)}
										</td>
									</tr>
								))}
							</tbody>
							<tfoot>
								<tr>
									<th scope="row">Total HT</th>
									{quarters.map((q) => {
										const value = arraySum(
											Object.values(budget[selectedYear]?.[q.label] ?? {})
										)

										return (
											<td key={q.label}>
												{value
													? formatValue(value, {
															displayedUnit: '€',
															language,
													  })
													: '-'}
											</td>
										)
									})}
									<td>
										{formatValue(
											arraySum(
												quarters.map((q) =>
													arraySum(
														Object.values(budget[selectedYear]?.[q.label] ?? {})
													)
												)
											),
											{
												displayedUnit: '€',
												language,
											}
										)}
									</td>
								</tr>
								<tr>
									<th scope="row">Total TTC</th>
									{quarters.map((q) => {
										const value = Math.round(
											arraySum(
												Object.values(budget[selectedYear]?.[q.label] ?? {})
											) * 1.2
										)

										return (
											<td key={q.label}>
												{value
													? formatValue(value, {
															displayedUnit: '€',
															language,
													  })
													: '-'}
											</td>
										)
									})}
									<td>
										{formatValue(
											Math.round(
												arraySum(
													quarters.map(
														(q) =>
															arraySum(
																Object.values(
																	budget[selectedYear]?.[q.label] ?? {}
																)
															) * 1.2
													)
												)
											),
											{
												displayedUnit: '€',
												language,
											}
										)}
									</td>
								</tr>
							</tfoot>
						</RessourcesAllocationTable>
					</div>

					<Markdown>{ressourcesDescription}</Markdown>
				</>
			)}
			<MoreInfosOnUs />
		</>
	)
}

const RessourcesAllocationTable = styled.table`
	text-align: left;
	width: 100%;
	td,
	th {
		padding: 6px;
		font-family: ${({ theme }) => theme.fonts.main};
	}

	td:not(:first-child),
	th:not(:first-child) {
		width: 100px;
		text-align: right;
	}

	tbody tr:nth-child(odd),
	tfoot tr:nth-child(odd) {
		background: ${({ theme }) =>
			theme.darkMode
				? theme.colors.extended.dark[700]
				: theme.colors.bases.primary[100]};
		color: inherit;
	}

	thead,
	tfoot {
		font-weight: bold;
	}

	tfoot tr:last-child {
		color: ${({ theme }) =>
			theme.darkMode
				? theme.colors.bases.primary[300]
				: theme.colors.bases.primary[700]};
		background-color: inherit;
	}
`
