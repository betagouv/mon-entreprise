import { formatValue } from 'publicodes'
import { useTranslation } from 'react-i18next'
import { styled } from 'styled-components'

import { Condition } from '@/components/EngineValue/Condition'
import { FlexCenter } from '@/design-system/global-style'
import { SearchIcon, WarningIcon } from '@/design-system/icons'
import { Tooltip } from '@/design-system/tooltip'

import {
	rémunérationBruteDottedName,
	Répartition as RépartitionType,
} from '../utils'
import Répartition from './Répartition'
import WarningSalaireTrans from './WarningSalaireTrans'

type Props = {
	id?: string
	rémunérationBrute: number
	réductionGénérale: number
	répartition: RépartitionType
	displayedUnit: string
	language: string
	displayNull?: boolean
}

export default function MontantRéduction({
	id,
	rémunérationBrute,
	réductionGénérale,
	répartition,
	displayedUnit,
	language,
	displayNull = true,
}: Props) {
	const { t } = useTranslation()

	const tooltip = <Répartition répartition={répartition} />

	return réductionGénérale ? (
		<StyledTooltip tooltip={tooltip}>
			<FlexDiv id={id}>
				{formatValue(
					{
						nodeValue: réductionGénérale,
					},
					{
						displayedUnit,
						language,
					}
				)}
				<StyledSearchIcon />
			</FlexDiv>
		</StyledTooltip>
	) : (
		displayNull && (
			<FlexDiv id={id}>
				{formatValue(0, { displayedUnit, language })}

				<Condition
					expression={`${rémunérationBruteDottedName} > 1.6 * SMIC`}
					contexte={{
						[rémunérationBruteDottedName]: rémunérationBrute,
					}}
				>
					<Tooltip tooltip={<WarningSalaireTrans />}>
						<span className="sr-only">{t('Attention')}</span>
						<StyledWarningIcon aria-label={t('Attention')} />
					</Tooltip>
				</Condition>
			</FlexDiv>
		)
	)
}

const StyledTooltip = styled(Tooltip)`
	width: 100%;
`
const FlexDiv = styled.div`
	${FlexCenter}
	justify-content: end;
`
const StyledSearchIcon = styled(SearchIcon)`
	margin-left: ${({ theme }) => theme.spacings.sm};
`
const StyledWarningIcon = styled(WarningIcon)`
	margin-top: ${({ theme }) => theme.spacings.xxs};
	margin-left: ${({ theme }) => theme.spacings.sm};
`
