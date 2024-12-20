import { formatValue, PublicodesExpression } from 'publicodes'
import { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { styled } from 'styled-components'

import { Condition } from '@/components/EngineValue/Condition'
import Répartition from '@/components/RéductionDeCotisations/Répartition'
import { FlexCenter } from '@/design-system/global-style'
import { SearchIcon, WarningIcon } from '@/design-system/icons'
import { Tooltip } from '@/design-system/tooltip'
import {
	RéductionDottedName,
	rémunérationBruteDottedName,
	Répartition as RépartitionType,
} from '@/utils/réductionDeCotisations'

type Props = {
	id?: string
	dottedName: RéductionDottedName
	rémunérationBrute: number
	réduction: number
	répartition: RépartitionType
	displayedUnit: string
	language: string
	warningCondition?: PublicodesExpression
	warningTooltip?: ReactNode
	alignment?: 'center' | 'end'
}

export default function MontantAvecRépartition({
	id,
	dottedName,
	rémunérationBrute,
	réduction,
	répartition,
	displayedUnit,
	language,
	warningCondition,
	warningTooltip,
	alignment = 'end',
}: Props) {
	const { t } = useTranslation()

	const tooltip = (
		<Répartition dottedName={dottedName} répartition={répartition} />
	)

	return réduction ? (
		<StyledTooltip tooltip={tooltip}>
			<FlexDiv id={id} $alignment={alignment}>
				{formatValue(
					{
						nodeValue: réduction,
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
		!!warningCondition && !!warningTooltip && (
			<FlexDiv id={id} $alignment={alignment}>
				{formatValue(0, { displayedUnit, language })}

				<Condition
					expression={warningCondition}
					contexte={{
						[rémunérationBruteDottedName]: rémunérationBrute,
					}}
				>
					<Tooltip tooltip={warningTooltip}>
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
