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
	lodeom: number
	répartition: RépartitionType
	displayedUnit: string
	language: string
	displayNull?: boolean
	alignment?: 'center' | 'end'
}

export default function MontantRéduction({
	id,
	rémunérationBrute,
	lodeom,
	répartition,
	displayedUnit,
	language,
	displayNull = true,
	alignment = 'end',
}: Props) {
	const { t } = useTranslation()

	const tooltip = <Répartition répartition={répartition} />

	return lodeom ? (
		<StyledTooltip tooltip={tooltip}>
			<FlexDiv id={id} $alignment={alignment}>
				{formatValue(
					{
						nodeValue: lodeom,
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
			<FlexDiv id={id} $alignment={alignment}>
				{formatValue(0, { displayedUnit, language })}

				<Condition
					expression="salarié . cotisations . exonérations . lodeom . montant = 0"
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
const FlexDiv = styled.div<{ $alignment: 'end' | 'center' }>`
	${FlexCenter}
	justify-content: ${({ $alignment }) => $alignment};
`
const StyledSearchIcon = styled(SearchIcon)`
	margin-left: ${({ theme }) => theme.spacings.sm};
`
const StyledWarningIcon = styled(WarningIcon)`
	margin-top: ${({ theme }) => theme.spacings.xxs};
	margin-left: ${({ theme }) => theme.spacings.sm};
`
