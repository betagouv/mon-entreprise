import Engine from 'publicodes'
import { ReactNode } from 'react'
import styled from 'styled-components'

import { DottedName } from '@/../../modele-social'
import Value, {
	WhenApplicable,
	WhenNotApplicable,
} from '@/components/EngineValue'
import RuleLink from '@/components/RuleLink'
import { HelpIcon } from '@/design-system/icons'
import { Grid } from '@/design-system/layout'

import { getBestOption, OptionType } from '../utils'
import { EngineComparison } from './Comparateur'
import StatusCard from './StatusCard'

const getGridSizes = (statusArray: OptionType[]) => {
	return { sizeXs: 12, sizeLg: 4 * statusArray.length }
}

const DetailsRowCards = ({
	namedEngines,
	dottedName,
	unit,
	bestOption,
	evolutionDottedName,
	evolutionLabel,
	label,
	footer,
	warning,
}: {
	namedEngines: EngineComparison
	dottedName: DottedName
	unit?: string
	bestOption?: 1 | 2 | 3
	evolutionDottedName?: DottedName
	evolutionLabel?: ReactNode | string
	label?: ReactNode | string

	warning?: (engine: Engine<DottedName>) => ReactNode
	footer?: (engine: Engine<DottedName>) => ReactNode
}) => {
	console.log(namedEngines)
	const options = namedEngines.map(({ engine, name }) => ({
		engine,
		name,
		value: engine.evaluate({
			valeur: dottedName,
			...(unit && { unité: unit }),
		}).nodeValue,
	})) as [OptionType, OptionType, OptionType]

	const bestOptionValue = bestOption ?? getBestOption(options)

	const groupedOptions = options
		.reduce((acc, option) => {
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
		}, [] as (typeof options)[0][][])

		.filter((arrayOfStatus) => arrayOfStatus.length > 0)

	return (
		<Grid container spacing={4}>
			{groupedOptions.map((sameValueOptions) => {
				const statusObject = sameValueOptions[0]

				const { sizeXs, sizeLg } = getGridSizes(sameValueOptions)

				return (
					<Grid
						key={`${dottedName}-${statusObject.name}`}
						item
						xs={sizeXs}
						lg={sizeLg}
						as="ul"
					>
						<StatusCard
							statut={sameValueOptions.map(({ name }) => name)}
							footerContent={footer?.(statusObject.engine)}
							isBestOption={
								sameValueOptions.length !== 3 &&
								bestOptionValue === statusObject.name
							}
						>
							<WhenNotApplicable
								dottedName={dottedName}
								engine={statusObject.engine}
							>
								<DisabledLabel>Ne s'applique pas</DisabledLabel>
								<StyledRuleLink
									documentationPath={`/simulateurs/comparaison-régimes-sociaux/${statusObject.name}`}
									dottedName={dottedName}
									engine={statusObject.engine}
								>
									<HelpIcon />
								</StyledRuleLink>
							</WhenNotApplicable>
							<WhenApplicable
								dottedName={dottedName}
								engine={statusObject.engine}
							>
								<StyledDiv>
									<span>
										<Value
											linkToRule={false}
											expression={dottedName}
											engine={statusObject.engine}
											precision={0}
											unit={unit}
										/>
										{label && ' '}
										{label && label}
									</span>
									<StyledRuleLink
										documentationPath={`/simulateurs/comparaison-régimes-sociaux/${statusObject.name}`}
										dottedName={dottedName}
										engine={statusObject.engine}
									>
										<HelpIcon />
									</StyledRuleLink>
									{warning?.(statusObject.engine)}
								</StyledDiv>
								{evolutionDottedName && (
									<Precisions>
										<Value
											linkToRule={false}
											expression={evolutionDottedName}
											engine={statusObject.engine}
											precision={0}
											unit={unit}
										/>{' '}
										{evolutionLabel}
									</Precisions>
								)}
								{!evolutionDottedName && evolutionLabel && (
									<Precisions>{evolutionLabel}</Precisions>
								)}
							</WhenApplicable>
						</StatusCard>
					</Grid>
				)
			})}
		</Grid>
	)
}

const StyledRuleLink = styled(RuleLink)`
	display: inline-flex;
	margin-left: ${({ theme }) => theme.spacings.xxs};
	&:hover {
		opacity: 0.8;
	}
`

const DisabledLabel = styled.span`
	color: ${({ theme }) => theme.colors.extended.grey[600]}!important;
	font-size: 1.25rem;
	font-weight: 700;
	font-style: italic;
	margin: 0 !important;
`

const Precisions = styled.span`
	display: block;
	font-family: ${({ theme }) => theme.fonts.main};
	font-weight: normal;
	font-size: 1rem;
	color: ${({ theme }) => theme.colors.extended.grey[700]};
	margin: 0 !important;
	margin-top: 0.5rem;
	width: 100%;
`

const StyledDiv = styled.div`
	width: 100%;
	display: flex;
	align-items: center;
`

export default DetailsRowCards
