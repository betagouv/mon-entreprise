import { formatValue, PublicodesExpression } from 'publicodes'
import { useTranslation } from 'react-i18next'
import { styled } from 'styled-components'

import NumberInput from '@/components/conversation/NumberInput'
import { Condition } from '@/components/EngineValue/Condition'
import { useEngine } from '@/components/utils/EngineContext'
import { SearchIcon, WarningIcon } from '@/design-system/icons'
import { Tooltip } from '@/design-system/tooltip'

import {
	MonthState,
	réductionGénéraleDottedName,
	rémunérationBruteDottedName,
} from '../utils'
import Répartition from './Répartition'
import WarningSalaireTrans from './WarningSalaireTrans'

type Props = {
	monthName: string
	data: MonthState
	index: number
	onChange: (monthIndex: number, rémunérationBrute: number) => void
}

type RémunérationBruteInput = {
	unité: string
	valeur: number
}

export default function RéductionGénéraleMoisParMoisRow({
	monthName,
	data,
	index,
	onChange,
}: Props) {
	const { t, i18n } = useTranslation()
	const language = i18n.language
	const displayedUnit = '€'
	const engine = useEngine()

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

	const tooltip = (
		<Répartition
			contexte={{
				[rémunérationBruteDottedName]: data.rémunérationBrute,
				[réductionGénéraleDottedName]:
					data.réductionGénérale + data.régularisation,
			}}
		/>
	)

	return (
		<tr>
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
							index,
							rémunérationBrute as RémunérationBruteInput
						)
					}
					value={data.rémunérationBrute}
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
				{data.réductionGénérale ? (
					<Tooltip tooltip={tooltip}>
						<StyledDiv>
							{formatValue(
								{
									nodeValue: data.réductionGénérale,
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
								[rémunérationBruteDottedName]: data.rémunérationBrute,
							}}
						>
							<Tooltip tooltip={<WarningSalaireTrans />}>
								<span className="sr-only">{t('Attention')}</span>
								<StyledWarningIcon aria-label={t('Attention')} />
							</Tooltip>
						</Condition>
					</StyledDiv>
				)}
			</td>
			<td
				id={`${réductionGénéraleDottedName.replace(
					/\s|\./g,
					'_'
				)}__régularisation-${monthName}`}
			>
				{formatValue(
					{
						nodeValue: data.régularisation,
					},
					{
						displayedUnit,
						language,
					}
				)}
			</td>
		</tr>
	)
}

const StyledDiv = styled.div`
	display: flex;
	align-items: center;
	gap: ${({ theme }) => theme.spacings.sm};
`

const StyledWarningIcon = styled(WarningIcon)`
	margin-top: ${({ theme }) => theme.spacings.xxs};
`
