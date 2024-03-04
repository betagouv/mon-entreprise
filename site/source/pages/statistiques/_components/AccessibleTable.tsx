import { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { styled } from 'styled-components'

import { Body } from '@/design-system/typography/paragraphs'

import { formatDay, formatMonth } from './utils'

interface AccessibleTableProps {
	period?: 'mois' | 'jours'
	data: {
		date?: string
		nombre: Record<string, number>
	}[]
	formatKey?: (key: string) => string
	formatValue?: (data: { key: string; value: number }) => string
	/**
	 * RGAA requires a caption for tables
	 */
	caption: ReactNode
}

export const AccessibleTable = ({
	period,
	data,
	formatKey,
	formatValue,
	caption,
}: AccessibleTableProps) => {
	const {
		t,
		i18n: { language },
	} = useTranslation()

	return (
		<StyledTable as="div" tabIndex={0}>
			<table role="table" style={{ textAlign: 'center', width: '100%' }}>
				{caption && <caption className="sr-only">{caption}</caption>}
				<thead>
					<tr>
						{period && (
							<th scope="col">{period === 'mois' ? t('Mois') : t('Jours')}</th>
						)}

						{Object.keys(data[0].nombre).map((key) => (
							<th scope="col" key={key}>
								{formatKey ? formatKey(key) : key}
							</th>
						))}
					</tr>
				</thead>

				<tbody>
					{data.flatMap((visite) => {
						if (typeof visite.nombre === 'number' && visite.date) {
							return (
								<tr key={visite.date}>
									<td>
										{period === 'mois'
											? formatMonth(visite.date, language)
											: formatDay(visite.date, language)}
									</td>

									<td>{visite.nombre}</td>
								</tr>
							)
						}

						const data = Object.entries(visite.nombre)
						const total = data.reduce((acc, [, value]) => acc + value, 0)
						if (total === 0) {
							return null
						}

						return (
							<tr key={visite.date}>
								{visite.date && (
									<td>
										{period === 'mois'
											? formatMonth(visite.date, language)
											: formatDay(visite.date, language)}
									</td>
								)}

								{data.map(([key, value]) => (
									<td key={key}>
										{formatValue ? formatValue({ key, value }) : value}
									</td>
								))}
							</tr>
						)
					})}
				</tbody>
			</table>
		</StyledTable>
	)
}

const StyledTable = styled(Body)`
	overflow: auto;

	table {
		width: 100%;
		border-collapse: collapse;

		th {
			min-width: 150px;
			padding: 0.25rem;
			background-color: ${({ theme }) =>
				theme.darkMode
					? theme.colors.extended.grey[700]
					: theme.colors.extended.grey[300]};
			border: 1px solid
				${({ theme }) =>
					theme.darkMode
						? theme.colors.extended.grey[700]
						: theme.colors.extended.grey[300]};

			&:first-letter {
				text-transform: capitalize;
			}
		}
		td {
			border: 1px solid
				${({ theme }) =>
					theme.darkMode
						? theme.colors.extended.grey[700]
						: theme.colors.extended.grey[300]};
		}
		tr:nth-child(2n + 1) {
			background-color: ${({ theme }) =>
				theme.darkMode
					? theme.colors.extended.grey[800]
					: theme.colors.extended.grey[200]};
		}
	}
`
