import { formatValue, PublicodesExpression } from 'publicodes'
import { useTranslation } from 'react-i18next'
import { styled } from 'styled-components'

import { ExplicableRule } from '@/components/conversation/Explicable'
import NumberInput from '@/components/conversation/NumberInput'
import { Condition } from '@/components/EngineValue/Condition'
import { useEngine } from '@/components/utils/EngineContext'
import { SearchIcon, WarningIcon } from '@/design-system/icons'
import { Tooltip } from '@/design-system/tooltip'

import Répartition from './components/Répartition'
import Warnings from './components/Warnings'
import WarningSalaireTrans from './components/WarningSalaireTrans'
import {
	MonthState,
	réductionGénéraleDottedName,
	rémunérationBruteDottedName,
} from './utils'

type RémunérationBruteInput = {
	unité: string
	valeur: number
}

export default function RéductionGénéraleMoisParMois({
	data,
	onChange,
}: {
	data: MonthState[]
	onChange: (monthIndex: number, rémunérationBrute: number) => void
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

	const onRémunérationChange = (
		monthIndex: number,
		rémunérationBrute: RémunérationBruteInput
	) => {
		onChange(monthIndex, rémunérationBrute.valeur)
	}

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
							<ExplicableRule dottedName={réductionGénéraleDottedName} light />
						</th>
						<th scope="col">{t('Régularisaton')}</th>
					</tr>
				</thead>
				<tbody>
					{data.length > 0 &&
						months.map((monthName, monthIndex) => {
							const tooltip = (
								<Répartition
									contexte={{
										[rémunérationBruteDottedName]:
											data[monthIndex].rémunérationBrute,
										[réductionGénéraleDottedName]:
											data[monthIndex].réductionGénérale +
											data[monthIndex].régularisation,
									}}
								/>
							)

							return (
								<tr key={`month-${monthIndex}`}>
									<th scope="row">{monthName}</th>
									<td>
										<NumberInput
											{...ruleInputProps}
											id={`${rémunérationBruteDottedName.replace(
												/\s|\./g,
												'_'
											)}-${monthName}`}
											aria-label={`${engine.getRule(rémunérationBruteDottedName)
												?.title} (${monthName})`}
											onChange={(rémunérationBrute?: PublicodesExpression) =>
												onRémunérationChange(
													monthIndex,
													rémunérationBrute as RémunérationBruteInput
												)
											}
											value={data[monthIndex].rémunérationBrute}
											formatOptions={{
												maximumFractionDigits: 2,
											}}
										/>
									</td>
									<td
										id={`${réductionGénéraleDottedName.replace(
											/\s|\./g,
											'_'
										)}-${monthName}`}
									>
										{data[monthIndex].réductionGénérale ? (
											<Tooltip tooltip={tooltip} hasArrow={true}>
												<StyledDiv>
													{formatValue(
														{
															nodeValue: data[monthIndex].réductionGénérale,
														},
														{
															displayedUnit,
															language,
														}
													)}
													<SearchIcon />
												</StyledDiv>
											</Tooltip>
										) : (
											<StyledDiv>
												{formatValue(0, { displayedUnit, language })}

												<Condition
													expression={`${rémunérationBruteDottedName} > 1.6 * SMIC`}
													contexte={{
														[rémunérationBruteDottedName]:
															data[monthIndex].rémunérationBrute,
													}}
												>
													<Tooltip
														tooltip={<WarningSalaireTrans />}
														hasArrow={true}
													>
														<span className="sr-only">{t('Attention')}</span>
														<StyledWarningIcon aria-label={t('Attention')} />
													</Tooltip>
												</Condition>
											</StyledDiv>
										)}
									</td>
									<td>
										{formatValue(
											{
												nodeValue: data[monthIndex].régularisation,
											},
											{
												displayedUnit,
												language,
											}
										)}
									</td>
								</tr>
							)
						})}
				</tbody>
			</StyledTable>

			<Warnings />
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

const StyledDiv = styled.div`
	display: flex;
	align-items: center;
	gap: ${({ theme }) => theme.spacings.sm};
`

const StyledWarningIcon = styled(WarningIcon)`
	margin-top: ${({ theme }) => theme.spacings.xxs};
`
