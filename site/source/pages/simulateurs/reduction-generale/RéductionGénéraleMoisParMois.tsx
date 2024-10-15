import { formatValue } from 'publicodes'
import { useTranslation } from 'react-i18next'
import { styled } from 'styled-components'

import { ExplicableRule } from '@/components/conversation/Explicable'
import NumberInput from '@/components/conversation/NumberInput'
import { useEngine } from '@/components/utils/EngineContext'

import { MonthState, rémunérationBruteDottedName } from './utils'

export default function RéductionGénéraleMoisParMois({
	data,
}: {
	data: MonthState[]
}) {
	const engine = useEngine()
	const { t, i18n } = useTranslation()
	const language = i18n.language
	const displayedUnit = '€'

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

	const onRémunérationChange = () => {}

	// TODO: enlever les 4 premières props après résolution de #3123
	const ruleInputProps = {
		dottedName: rémunérationBruteDottedName,
		suggestions: {},
		description: undefined,
		question: undefined,
		engine,
		'aria-labelledby': 'simu-update-explaining',
		formatOptions: {
			maximumFractionDigits: 0,
		},
		displayedUnit,
		unit: {
			numerators: ['€'],
			denominators: [],
		},
	}

	return (
		<>
			<StyledTable style={{ width: '100%' }}>
				<caption>{t('Réduction générale mois par mois :')}</caption>
				<thead>
					<tr>
						<th scope="col">{t('Mois')}</th>
						<th scope="col">
							{t('Rémunération brute', 'Rémunération brute')}
							<ExplicableRule dottedName="salarié . rémunération . brut" />
						</th>
						<th scope="col">
							{t('Réduction générale')}
							<ExplicableRule
								dottedName="salarié . cotisations . exonérations . réduction générale"
								light
							/>
						</th>
					</tr>
				</thead>
				<tbody>
					{data.length > 0 &&
						months.map((monthName, monthIndex) => (
							<tr key={`month-${monthIndex}`}>
								<th scope="row">{monthName}</th>
								<td>
									<NumberInput
										{...ruleInputProps}
										id={`${rémunérationBruteDottedName.replace(
											/\s|\./g,
											'_'
										)}-${monthIndex}`}
										aria-label={`${engine.getRule(rémunérationBruteDottedName)
											?.title} (${monthName})`}
										onChange={onRémunérationChange}
										value={data[monthIndex].rémunérationBrute}
									/>
								</td>
								<td>
									{data[monthIndex].réductionGénérale
										? formatValue(
												{ nodeValue: data[monthIndex].réductionGénérale },
												{
													displayedUnit,
													language,
												}
										  )
										: formatValue(0, { displayedUnit, language })}
								</td>
							</tr>
						))}
				</tbody>
			</StyledTable>
		</>
	)
}

const StyledTable = styled.table`
	text-align: left;
	width: 100%;
	color: ${({ theme }) => theme.colors.bases.primary[100]};
	font-family: ${({ theme }) => theme.fonts.main};
	caption {
		text-align: left;
		margin: ${({ theme }) => `${theme.spacings.sm} 0 `};
	}
	th {
		padding: ${({ theme }) => `${theme.spacings.xs} 0 ${theme.spacings.lg} 0`};
	}
	tbody tr td:not(:first-of-type) {
		padding: ${({ theme }) =>
			`${theme.spacings.xs} ${theme.spacings.xxs} ${theme.spacings.lg} ${theme.spacings.xxs}`};
	}
	tbody tr th {
		text-transform: capitalize;
		font-weight: normal;
	}
`
