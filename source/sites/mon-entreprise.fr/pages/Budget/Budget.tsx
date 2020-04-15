import MoreInfosOnUs from 'Components/MoreInfosOnUs'
import { Markdown } from 'Components/utils/markdown'
import { ScrollToTop } from 'Components/utils/Scroll'
import { formatCurrency } from 'Engine/format'
import { sum, uniq } from 'ramda'
import React, { useState } from 'react'
import emoji from 'react-easy-emoji'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import prose from './budget.md'
import budget from './budget.yaml'

// Splitting the markdown file to insert React components in-between is a bit
// arcane, we may consider MDX in the future https://github.com/mdx-js/mdx.
const [
	intro,
	ressources2019,
	ressources2020,
	ressourcesDescription
] = prose.split(/\r?\n-{3,}\r?\n/)

const ressources = {
	2019: ressources2019,
	2020: ressources2020
}

export default function Budget() {
	const [selectedYear, setSelectedYear] = useState('2020')
	const years = ['2019', '2020']
	const quarters = ['T1', 'T2', 'T3', 'T4']
	const categories = uniq(
		quarters
			.map(q => Object.keys(budget[2020][q] ?? {}))
			.reduce((acc, curr) => [...acc, ...curr], [])
	)

	const { language } = useTranslation().i18n
	return (
		<>
			<ScrollToTop />
			<h1>Budget {emoji('💶')}</h1>
			<Markdown source={intro} />
			<label>
				{emoji('📅')} Année{' '}
				<select
					value={selectedYear}
					onChange={event => setSelectedYear(event.target.value)}
				>
					{years.map(year => (
						<option key={year}>{year}</option>
					))}
				</select>
			</label>
			<Markdown source={ressources[selectedYear]} />
			{selectedYear !== '2019' && (
				<>
					<h2>Emploi des ressources</h2>
					<RessourcesAllocationTable>
						<thead>
							<tr>
								<td>2020</td>
								{quarters.map(q => (
									<td key={q}>{q}</td>
								))}
							</tr>
						</thead>
						<tbody>
							{categories.map(label => (
								<tr key={label}>
									<td>{label}</td>
									{quarters.map(q => {
										const value = budget[2020]?.[q]?.[label]
										return (
											<td key={q}>
												{value ? formatCurrency(value, language) : '-'}
											</td>
										)
									})}
								</tr>
							))}
						</tbody>
						<tfoot>
							<tr>
								<td>Total</td>
								<td>
									{formatCurrency(
										sum(Object.values(budget[2020]['T1'])),
										language
									)}
								</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>
							</tr>
						</tfoot>
					</RessourcesAllocationTable>
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

	tbody tr:nth-child(2n + 1),
	tfoot tr {
		background: var(--lighterColor);
	}

	thead,
	tfoot {
		font-weight: bold;
	}
`
