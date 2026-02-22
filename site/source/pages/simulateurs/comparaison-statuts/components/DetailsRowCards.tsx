import { DottedName } from 'modele-social'
import Engine, { PublicodesExpression } from 'publicodes'
import { ReactNode } from 'react'
import { Trans } from 'react-i18next'
import { styled } from 'styled-components'

import Value from '@/components/EngineValue/Value'
import { WhenNotApplicable } from '@/components/EngineValue/WhenNotApplicable'
import RuleLink from '@/components/RuleLink'
import { StatutTag } from '@/components/StatutTag'
import { Grid, HelpIcon, StatusCard, Strong, Ul } from '@/design-system'
import { EngineComparison } from '@/pages/simulateurs/comparaison-statuts/EngineComparison'

import { OptionType } from '../utils'

export const getGridSizes = (numberOptions: number, total: number) => {
	return {
		xs: 12,
		// sm: total === 2 ? 6 : 12,
		lg: (12 / total) * numberOptions,
	}
}

const DetailsRowCards = ({
	namedEngines,
	dottedName,
	expression,
	unit,
	evolutionDottedName,
	evolutionLabel,
	label,
	footer,
	displayedUnit,
	warning,
}: {
	namedEngines: EngineComparison
	dottedName?: DottedName
	expression?: PublicodesExpression
	unit?: string
	displayedUnit?: string
	evolutionDottedName?: DottedName
	evolutionLabel?: ReactNode | string
	label?: ReactNode | string

	warning?: (engine: Engine<DottedName>) => ReactNode
	footer?: (engine: Engine<DottedName>) => ReactNode
}) => {
	const expressionOrDottedName = dottedName ?? expression
	const options = namedEngines.map(({ engine, name }) => {
		const evaluation = engine.evaluate({
			valeur: expressionOrDottedName,
			...(unit && { unité: unit }),
		})

		return {
			engine,
			name,
			value: evaluation.nodeValue,
		}
	}) as [OptionType, OptionType, OptionType]

	const groupedOptions = options
		.reduce(
			(acc, option) => {
				const newAcc = [...acc]
				const sameValues = options.filter(
					(optionFiltered) => optionFiltered.value === option.value
				)
				// Avoid duplicates
				if (
					!newAcc.find((arrayOfStatus) =>
						arrayOfStatus.some(
							(statusObject) => statusObject.value === option.value
						)
					)
				) {
					return [...newAcc, sameValues]
				}

				return newAcc
			},
			[] as (typeof options)[0][][]
		)

		.filter((arrayOfStatus) => arrayOfStatus.length > 0)

	return (
		<Grid container spacing={4} as={Ul}>
			{groupedOptions.map((sameValueOptions) => {
				const statusObject = sameValueOptions[0]
				const { engine } = statusObject

				// Évaluation directe au lieu de <Condition> — voir #4323
				const isDefinedAndApplicable =
					expressionOrDottedName &&
					engine.evaluate({
						et: [
							{ 'est défini': expressionOrDottedName },
							{ 'est applicable': expressionOrDottedName },
						],
					}).nodeValue

				const isNotDefined =
					expressionOrDottedName &&
					engine.evaluate({
						'est non défini': expressionOrDottedName,
					}).nodeValue

				return (
					<Grid
						key={statusObject.name}
						item
						as="li"
						{...getGridSizes(sameValueOptions.length, options.length)}
					>
						<StatusCard>
							{sameValueOptions.map(({ name }) => (
								<StatusCard.Étiquette key={name}>
									<StatutTag statut={name} text="acronym" showIcon />
								</StatusCard.Étiquette>
							))}
							{expressionOrDottedName && (
								<StatusCard.Titre>
									{dottedName && (
										<WhenNotApplicable dottedName={dottedName} engine={engine}>
											<DisabledLabel>Ne s'applique pas</DisabledLabel>
											<StyledRuleLink
												documentationPath={`${statusObject.name as string}`}
												dottedName={dottedName}
												engine={engine}
											>
												<HelpIcon />
											</StyledRuleLink>
										</WhenNotApplicable>
									)}
									{isDefinedAndApplicable && (
										<StyledDiv>
											<span>
												<Value
													linkToRule={false}
													expression={expressionOrDottedName}
													engine={engine}
													precision={0}
													unit={unit}
													displayedUnit={displayedUnit}
												/>
												{label && ' '}
												{label && label}
											</span>
											{dottedName && (
												<StyledRuleLink
													documentationPath={`${statusObject.name}`}
													dottedName={dottedName}
													engine={engine}
												>
													<HelpIcon />
												</StyledRuleLink>
											)}
											{warning?.(engine)}
										</StyledDiv>
									)}
									{isNotDefined && (
										<StyledSmall>
											<Trans>
												Le montant demandé n'est{' '}
												<Strong>pas calculable...</Strong>
											</Trans>
										</StyledSmall>
									)}
								</StatusCard.Titre>
							)}
							{evolutionDottedName && (
								<StatusCard.ValeurSecondaire>
									<Value
										linkToRule={false}
										expression={evolutionDottedName}
										engine={engine}
										precision={0}
										unit={unit}
									/>{' '}
									{evolutionLabel}
								</StatusCard.ValeurSecondaire>
							)}
							{!evolutionDottedName && evolutionLabel && (
								<StatusCard.ValeurSecondaire>
									{evolutionLabel}
								</StatusCard.ValeurSecondaire>
							)}
							{footer?.(engine) && (
								<StatusCard.Action>{footer?.(engine)}</StatusCard.Action>
							)}
						</StatusCard>
					</Grid>
				)
			})}
		</Grid>
	)
}

const StyledSmall = styled.small`
	color: ${({ theme }) => theme.colors.extended.grey[800]};
	font-weight: normal;
	font-size: 80%;
`

const StyledRuleLink = styled(RuleLink)`
	display: inline-flex;
	margin-left: ${({ theme }) => theme.spacings.xxs};
	&:hover {
		opacity: 0.8;
	}
`

const DisabledLabel = styled.span`
	color: ${({ theme }) => theme.colors.extended.grey[800]}!important;
	font-size: 1.25rem;
	font-weight: 700;
	font-style: italic;
	margin: 0 !important;
`

const StyledDiv = styled.div`
	width: 100%;
	display: flex;
	align-items: center;
`

export default DetailsRowCards
