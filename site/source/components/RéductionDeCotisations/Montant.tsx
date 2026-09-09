import { formatValue, PublicodesExpression } from 'publicodes'
import { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { styled } from 'styled-components'

import { Condition } from '@/components/EngineValue/Condition'
import Répartition from '@/components/RéductionDeCotisations/Répartition'
import { EyeIcon, FlexCenter, Tooltip, WarningIcon } from '@/design-system'
import {
	rémunérationBruteDottedName,
	Répartition as RépartitionType,
} from '@/utils/réductionDeCotisations'

type Props = {
	id: string
	rémunérationBrute: number
	réduction: number
	répartition: RépartitionType
	displayedUnit: string
	language: string
	warningCondition?: PublicodesExpression
	warningTooltip?: ReactNode
	alignment?: 'center' | 'end'
	withRépartition?: boolean
}

export default function Montant({
	id,
	rémunérationBrute,
	réduction,
	répartition,
	displayedUnit,
	language,
	warningCondition,
	warningTooltip,
	alignment = 'end',
	withRépartition = true,
}: Props) {
	const { t } = useTranslation()

	const tooltip = withRépartition && (
		<Répartition idPrefix={id} répartition={répartition} />
	)

	return réduction ? (
		tooltip ? (
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
					<StyledEyeIcon />
				</FlexDiv>
			</StyledTooltip>
		) : (
			<FlexDiv id={id} $alignment="center">
				{formatValue(
					{
						nodeValue: réduction,
					},
					{
						displayedUnit,
						language,
					}
				)}
			</FlexDiv>
		)
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
						<StyledWarningIcon />
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
const StyledEyeIcon = styled(EyeIcon)`
	fill: ${({ theme }) => theme.colors.extended.grey[100]};
	margin-left: ${({ theme }) => theme.spacings.sm};
`
const StyledWarningIcon = styled(WarningIcon)`
	margin-top: ${({ theme }) => theme.spacings.xxs};
	margin-left: ${({ theme }) => theme.spacings.sm};
`
