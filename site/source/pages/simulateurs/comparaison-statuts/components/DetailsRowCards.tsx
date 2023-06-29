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
import { Body } from '@/design-system/typography/paragraphs'

import { getBestOption, OptionType } from '../utils'
import { EngineComparison } from './Comparateur'
import StatusCard from './StatusCard'

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
	unit,
	leastIsBest = false,
	evolutionDottedName,
	evolutionLabel,
	label,
	footer,
	warning,
}: {
	namedEngines: EngineComparison
	dottedName: DottedName
	unit?: string
	leastIsBest?: boolean
	evolutionDottedName?: DottedName
	evolutionLabel?: ReactNode | string
	label?: ReactNode | string

	warning?: (engine: Engine<DottedName>) => ReactNode
	footer?: (engine: Engine<DottedName>) => ReactNode
}) => {
	const options = namedEngines.map(({ engine, name }) => ({
		engine,
		name,
		value: engine.evaluate({
			valeur: dottedName,
			...(unit && { unité: unit }),
		}).nodeValue,
	})) as [OptionType, OptionType, OptionType]

	const bestOptionValue = getBestOption(options, leastIsBest)

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

				return (
					<Grid
						key={`${dottedName}-${statusObject.name as string}`}
						item
						{...getGridSizes(sameValueOptions.length, options.length)}
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
							<StyledBody as="div">
								<WhenNotApplicable
									dottedName={dottedName}
									engine={statusObject.engine}
								>
									<DisabledLabel>Ne s'applique pas</DisabledLabel>
									<StyledRuleLink
										documentationPath={`${statusObject.name as string}`}
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
											documentationPath={`${statusObject.name}`}
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
							</StyledBody>
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
const StyledBody = styled(Body)`
	font-size: 1.25rem;
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	font-weight: 700;
	margin: 0;
	margin-top: 0.75rem;
`
