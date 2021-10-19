import MoreInfosOnUs from 'Components/MoreInfosOnUs'
import Emoji from 'Components/utils/Emoji'
import { Markdown } from 'Components/utils/markdown'
import { ScrollToTop } from 'Components/utils/Scroll'
import { formatValue } from 'publicodes'
import { sum, uniq } from 'ramda'
import { useState } from 'react'
import { Helmet } from 'react-helmet'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { TrackPage } from '../../ATInternetTracking'
import Meta from '../../components/utils/Meta'
import prose from './budget.md'
import budget from './budget.yaml'

// Splitting the markdown file to insert React components in-between is a bit
// arcane, we may consider MDX in the future https://github.com/mdx-js/mdx.
const [
	intro,
	ressources2019,
	ressources2020,
	ressources2021,
	ressourcesDescription,
] = prose.split(/\r?\n-{3,}\r?\n/)

const ressources = {
	2019: ressources2019,
	2020: ressources2020,
	2021: ressources2021,
}

export default function Budget() {
	const years = ['2019', '2020', '2021'] as const
	const quarters = ['T1', 'T2', 'T3', 'T4']
	const [selectedYear, setSelectedYear] = useState<typeof years[number]>('2021')
	const categories = uniq(
		quarters
			.map((q) => Object.keys(budget[selectedYear]?.[q] ?? {}))
			.reduce((acc, curr) => [...acc, ...curr], [])
	)

	const { language } = useTranslation().i18n
	return (
		<>
			<TrackPage chapter1="informations" name="budget" />
			<Meta
				page="budget"
				title="Budget"
				description="Le budget de mon-entreprise.fr"
			/>
			<ScrollToTop />
			<h1>
				Budget <Emoji emoji="💶" />
			</h1>
			<Markdown source={intro} />
			<label>
				<Emoji emoji="📅" /> Année{' '}
				<select
					value={selectedYear}
					onChange={(event) =>
						setSelectedYear(event.target.value as typeof years[number])
					}
				>
					{years.map((year) => (
						<option key={year}>{year}</option>
					))}
				</select>
			</label>
			<h2>Budget consommé</h2>
			<Markdown source={ressources[selectedYear]} />
			{selectedYear !== '2019' && (
				<>
					<div
						css={`
							overflow: auto;
						`}
					>
						<RessourcesAllocationTable>
							<thead>
								<tr>
									<td>{selectedYear}</td>
									{quarters.map((q) => (
										<td key={q}>{q}</td>
									))}
									<td>Total</td>
								</tr>
							</thead>
							<tbody>
								{categories.map((label) => (
									<tr key={label}>
										<td>{label}</td>
										{quarters.map((q) => {
											const value = budget[selectedYear]?.[q]?.[label]
											return (
												<td key={q}>
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
												sum(
													quarters.map(
														(q) => budget[selectedYear]?.[q]?.[label] ?? 0
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
									<td>Total HT</td>
									{quarters.map((q) => {
										const value = sum(
											Object.values(budget[selectedYear]?.[q] ?? {})
										)
										return (
											<td key={q}>
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
											sum(
												quarters.map((q) =>
													sum(Object.values(budget[selectedYear]?.[q] ?? {}))
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
									<td>Total TTC</td>
									{quarters.map((q) => {
										const value = Math.round(
											sum(Object.values(budget[selectedYear]?.[q] ?? {})) * 1.2
										)
										return (
											<td key={q}>
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
												sum(
													quarters.map(
														(q) =>
															sum(
																Object.values(budget[selectedYear]?.[q] ?? {})
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
					<Markdown source={ressourcesDescription} />
				</>
			)}
			<MoreInfosOnUs />
		</>
	)
}

const RessourcesAllocationTable = styled.table`
	width: 100%;
	text-align: left;
	td {
		padding: 6px;
	}

	td:not(:first-child) {
		width: 100px;
		text-align: right;
	}

	tbody tr:nth-child(odd),
	tfoot tr:nth-child(odd) {
		background: var(--lighterColor);
	}

	thead,
	tfoot {
		font-weight: bold;
	}

	tfoot tr:last-child {
		color: var(--lighterTextColor);
	}
`
