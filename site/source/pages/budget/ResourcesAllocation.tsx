import { sumAll } from 'effect/Number'
import { formatValue } from 'publicodes'
import { styled } from 'styled-components'

type Budget = Record<string, Record<string, number>>

type Props = {
	selectedYear: string
	budget: Budget
}

export default function ResourcesAllocation({ selectedYear, budget }: Props) {
	const quarters = [
		{ label: 'T1', 'aria-label': 'Trimestre 1' },
		{ label: 'T2', 'aria-label': 'Trimestre 2' },
		{ label: 'T3', 'aria-label': 'Trimestre 3' },
		{ label: 'T4', 'aria-label': 'Trimestre 4' },
	]

	const categories = [
		...new Set(
			quarters
				.map((quarter) => Object.keys(budget[quarter.label] ?? {}))
				.reduce((acc, curr) => [...acc, ...curr], [])
		),
	]

	const totals = quarters.reduce((total, quarter) => {
		const quarterTotal = sumAll(Object.values(budget[quarter.label]))

		return {
			...total,
			[quarter.label]: {
				'Total HT': quarterTotal,
				'Total TTC': Math.round(quarterTotal * 1.2),
			},
		}
	}, {} as Budget)

	return (
		<div
			style={{
				overflowX: 'auto',
			}}
		>
			<StyledTable role="table">
				<caption className="sr-only">
					{`Tableau affichant le bugdet de l'année ${selectedYear} par poste de dépenses. La première colonne affiche l'année en cours (${selectedYear}) sur la première ligne puis les postes de dépenses et pour finir le total HT et total TTC. Les autres colonnes affichent les dépenses pour chaque trimestre. La dernière colonne affiche les totaux pour chaque poste de dépenses ainsi que les totaux HT et TTC agrégés.`}
				</caption>
				<thead>
					<tr>
						<th>{selectedYear}</th>
						{quarters.map((quarter) => (
							<th
								scope="col"
								key={quarter.label}
								aria-label={quarter['aria-label']}
							>
								{quarter.label}
							</th>
						))}
						<th scope="col">Total</th>
					</tr>
				</thead>
				<tbody>
					{categories.map((label) => (
						<tr key={label}>
							<th scope="row">{label}</th>
							{quarters.map((quarter) => {
								const value = budget[quarter.label][label]

								return (
									<td key={quarter.label}>
										{value ? (
											formatValue(value, {
												displayedUnit: '€',
											})
										) : (
											<span aria-label="Pas de budget alloué">-</span>
										)}
									</td>
								)
							})}
							<td>
								{/* Total de ligne */}
								{formatValue(
									sumAll(
										quarters.map((quarter) => budget[quarter.label][label] ?? 0)
									),
									{
										displayedUnit: '€',
									}
								)}
							</td>
						</tr>
					))}
				</tbody>
				<tfoot>
					{['Total HT', 'Total TTC'].map((total) => (
						<tr key={total}>
							<th scope="row">{total}</th>
							{quarters.map((quarter) => {
								const value = totals[quarter.label][total] ?? 0

								return (
									<td key={quarter.label}>
										{formatValue(value, {
											displayedUnit: '€',
										})}
									</td>
								)
							})}
							<td>
								{/* Total du total */}
								{formatValue(
									sumAll(
										quarters.map((quarter) => totals[quarter.label][total])
									),
									{
										displayedUnit: '€',
									}
								)}
							</td>
						</tr>
					))}
				</tfoot>
			</StyledTable>
		</div>
	)
}

const StyledTable = styled.table`
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
