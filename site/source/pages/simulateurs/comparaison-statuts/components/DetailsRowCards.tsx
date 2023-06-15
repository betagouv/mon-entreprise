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
import StatusCard from './StatusCard'

const getStatusLabelsArray = (statusArray: OptionType[]) =>
	statusArray.map((statusOption) => statusOption.type)

const getGridSizes = (statusArray: OptionType[]) => {
	return { sizeXs: 12, sizeLg: 4 * statusArray.length }
}

const DetailsRowCards = ({
	engines: [assimiléEngine, autoEntrepreneurEngine, indépendantEngine],
	dottedName,
	unit,
	bestOption,
	evolutionDottedName,
	evolutionLabel,
	footers,
	label,
	warnings,
}: {
	engines: [Engine<DottedName>, Engine<DottedName>, Engine<DottedName>]
	dottedName: DottedName
	unit?: string
	bestOption?: 'sasu' | 'ei' | 'ae'
	evolutionDottedName?: DottedName
	evolutionLabel?: ReactNode | string
	footers?: { sasu: ReactNode; ei: ReactNode; ae: ReactNode }
	label?: ReactNode | string

	warnings?: { sasu?: ReactNode; ei?: ReactNode; ae?: ReactNode }
}) => {
	const assimiléEvaluation = assimiléEngine.evaluate({
		valeur: dottedName,
		...(unit && { unité: unit }),
	})

	const indépendantEvaluation = indépendantEngine.evaluate({
		valeur: dottedName,
		...(unit && { unité: unit }),
	})

	const autoEntrepreneurEvaluation = autoEntrepreneurEngine.evaluate({
		valeur: dottedName,
		...(unit && { unité: unit }),
	})

	const options: OptionType[] = [
		{
			type: 'sasu',
			value: Math.round(assimiléEvaluation.nodeValue as number),
			engine: assimiléEngine,
			documentationPath: '/simulateurs/comparaison-régimes-sociaux/SASU',
		},
		{
			type: 'ei',
			value: Math.round(indépendantEvaluation.nodeValue as number),
			engine: indépendantEngine,
			documentationPath: '/simulateurs/comparaison-régimes-sociaux/EI',
		},
		{
			type: 'ae',
			value: Math.round(autoEntrepreneurEvaluation.nodeValue as number),
			engine: autoEntrepreneurEngine,
			documentationPath:
				'/simulateurs/comparaison-régimes-sociaux/auto-entrepreneur',
		},
	]

	const bestOptionValue = bestOption ?? getBestOption(options)

	const sortedStatus = [...options]
		.reduce((acc: OptionType[][], option: OptionType) => {
			const newAcc = [...acc]
			const sameValues = options.filter(
				(optionFiltered) => optionFiltered.value === option.value
			)
			// Avoid duplicates
			if (
				!newAcc.find((arrayOfStatus) =>
					arrayOfStatus.some(
						(statusObject: OptionType) => statusObject.value === option.value
					)
				)
			) {
				return [...newAcc, sameValues]
			}

			return newAcc
		}, [] as OptionType[][])
		.filter((arrayOfStatus: OptionType[]) => arrayOfStatus.length > 0)

	return (
		<Grid container spacing={4}>
			{sortedStatus.map((statusArray: OptionType[]) => {
				const statusObject: OptionType = statusArray[0]

				const { sizeXs, sizeLg } = getGridSizes(statusArray)

				return (
					<Grid
						key={`${dottedName}-${statusObject.type}`}
						item
						xs={sizeXs}
						lg={sizeLg}
						as="ul"
					>
						<StatusCard
							status={getStatusLabelsArray(statusArray)}
							footerContent={footers?.[statusObject.type]}
							isBestOption={
								statusArray.length !== 3 &&
								bestOptionValue === statusObject.type
							}
						>
							<WhenNotApplicable
								dottedName={dottedName}
								engine={statusObject.engine}
							>
								<DisabledLabel>Ne s'applique pas</DisabledLabel>
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
										documentationPath={statusObject.documentationPath}
										dottedName={dottedName}
										engine={statusObject.engine}
									>
										<HelpIcon />
									</StyledRuleLink>
									{warnings?.[statusObject.type] &&
										warnings?.[statusObject.type]}
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
