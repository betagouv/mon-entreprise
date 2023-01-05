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

import StatusCard from './StatusCard'

const DetailsRowCards = ({
	engines: [assimiléEngine, autoEntrepreneurEngine, indépendantEngine],
	dottedName,
	unit,
	bestOption,
	evolutionDottedName,
	evolutionLabel,
	footers,
	label,
}: {
	engines: [Engine<DottedName>, Engine<DottedName>, Engine<DottedName>]
	dottedName: DottedName
	unit?: string
	bestOption?: 'sasu' | 'ei' | 'ae'
	evolutionDottedName?: DottedName
	evolutionLabel?: ReactNode | string
	footers?: { sasu: ReactNode; ei: ReactNode; ae: ReactNode }
	label?: ReactNode | string
}) => {
	const assimiléValue = assimiléEngine.evaluate(dottedName).nodeValue
	const indépendantValue = indépendantEngine.evaluate(dottedName).nodeValue
	const autoEntrepreneurValue =
		autoEntrepreneurEngine.evaluate(dottedName).nodeValue

	if (assimiléValue === indépendantValue) {
		return (
			<Grid container spacing={4}>
				<Grid item xs={12} lg={8}>
					<StatusCard
						status={['sasu', 'ei']}
						isBestOption={bestOption === 'sasu'}
						footerContent={footers?.sasu}
					>
						<WhenNotApplicable dottedName={dottedName}>
							<DisabledLabel>Ne s'applique pas</DisabledLabel>
						</WhenNotApplicable>
						<WhenApplicable dottedName={dottedName}>
							<span>
								<Value
									linkToRule={false}
									expression={dottedName}
									engine={assimiléEngine}
									precision={0}
									unit={unit}
								/>
								{label && ' '}
								{label && label}
							</span>
							<StyledRuleLink dottedName={dottedName} engine={assimiléEngine}>
								<HelpIcon />
							</StyledRuleLink>
							{evolutionDottedName && (
								<Precisions>
									<Value
										linkToRule={false}
										expression={evolutionDottedName}
										engine={assimiléEngine}
										precision={0}
										unit={unit}
									/>{' '}
									{evolutionLabel}
								</Precisions>
							)}
						</WhenApplicable>
					</StatusCard>
				</Grid>
				<Grid item xs={12} lg={4}>
					<StatusCard
						status={['ae']}
						footerContent={footers?.ei}
						isBestOption={bestOption === 'ae'}
					>
						<WhenNotApplicable dottedName={dottedName}>
							<DisabledLabel>Ne s'applique pas</DisabledLabel>
						</WhenNotApplicable>
						<WhenApplicable dottedName={dottedName}>
							<span>
								<Value
									linkToRule={false}
									expression={dottedName}
									engine={assimiléEngine}
									precision={0}
									unit={unit}
								/>
								{label && ' '}
								{label && label}
							</span>
							<StyledRuleLink dottedName={dottedName} engine={assimiléEngine}>
								<HelpIcon />
							</StyledRuleLink>
							{evolutionDottedName && (
								<Precisions>
									<Value
										linkToRule={false}
										expression={evolutionDottedName}
										engine={assimiléEngine}
										precision={0}
										unit={unit}
									/>{' '}
									{evolutionLabel}
								</Precisions>
							)}
						</WhenApplicable>
					</StatusCard>
				</Grid>
			</Grid>
		)
	}

	if (indépendantValue === autoEntrepreneurValue) {
		return (
			<Grid container spacing={4}>
				<Grid item xs={12} lg={4}>
					<StatusCard
						status={['sasu']}
						footerContent={footers?.sasu}
						isBestOption={bestOption === 'sasu'}
					>
						<WhenNotApplicable dottedName={dottedName}>
							<DisabledLabel>Ne s'applique pas</DisabledLabel>
						</WhenNotApplicable>
						<WhenApplicable dottedName={dottedName}>
							<span>
								<Value
									linkToRule={false}
									expression={dottedName}
									engine={assimiléEngine}
									precision={0}
									unit={unit}
								/>
								{label && ' '}
								{label && label}
							</span>
							<StyledRuleLink dottedName={dottedName} engine={assimiléEngine}>
								<HelpIcon />
							</StyledRuleLink>
							{evolutionDottedName && (
								<Precisions>
									<Value
										linkToRule={false}
										expression={evolutionDottedName}
										engine={assimiléEngine}
										precision={0}
										unit={unit}
									/>{' '}
									{evolutionLabel}
								</Precisions>
							)}
						</WhenApplicable>
					</StatusCard>
				</Grid>
				<Grid item xs={12} lg={8}>
					<StatusCard
						status={['ei', 'ae']}
						footerContent={footers?.ei}
						isBestOption={bestOption === 'ei'}
					>
						<WhenNotApplicable dottedName={dottedName}>
							<DisabledLabel>Ne s'applique pas</DisabledLabel>
						</WhenNotApplicable>
						<WhenApplicable dottedName={dottedName}>
							<span>
								<Value
									linkToRule={false}
									expression={dottedName}
									engine={indépendantEngine}
									precision={0}
									unit={unit}
								/>
								{label && ' '}
								{label && label}
							</span>
							<StyledRuleLink
								dottedName={dottedName}
								engine={indépendantEngine}
							>
								<HelpIcon />
							</StyledRuleLink>
							{evolutionDottedName && (
								<Precisions>
									<Value
										linkToRule={false}
										expression={evolutionDottedName}
										engine={indépendantEngine}
										precision={0}
										unit={unit}
									/>{' '}
									{evolutionLabel}
								</Precisions>
							)}
						</WhenApplicable>
					</StatusCard>
				</Grid>
			</Grid>
		)
	}

	return (
		<Grid container spacing={4}>
			<Grid item xs={12} lg={4}>
				<StatusCard
					status={['sasu']}
					footerContent={footers?.sasu}
					isBestOption={bestOption === 'sasu'}
				>
					<span>
						<Value
							linkToRule={false}
							expression={dottedName}
							engine={assimiléEngine}
							precision={0}
							unit={unit}
						/>
						{label && ' '}
						{label && label}
					</span>
					<StyledRuleLink dottedName={dottedName} engine={assimiléEngine}>
						<HelpIcon />
					</StyledRuleLink>
				</StatusCard>
			</Grid>
			<Grid item xs={12} lg={4}>
				<StatusCard
					status={['ei']}
					footerContent={footers?.ei}
					isBestOption={bestOption === 'ei'}
				>
					<span>
						<Value
							linkToRule={false}
							expression={dottedName}
							engine={indépendantEngine}
							precision={0}
							unit={unit}
						/>
						{label && ' '}
						{label && label}
					</span>
					<StyledRuleLink dottedName={dottedName} engine={assimiléEngine}>
						<HelpIcon />
					</StyledRuleLink>
				</StatusCard>
			</Grid>
			<Grid item xs={12} lg={4}>
				<StatusCard
					status={['ae']}
					footerContent={footers?.ae}
					isBestOption={bestOption === 'ae'}
				>
					<span>
						<Value
							linkToRule={false}
							expression={dottedName}
							engine={autoEntrepreneurEngine}
							precision={0}
							unit={unit}
						/>{' '}
						{label && ' '}
						{label && label}
					</span>
					<StyledRuleLink dottedName={dottedName} engine={assimiléEngine}>
						<HelpIcon />
					</StyledRuleLink>
				</StatusCard>
			</Grid>
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

const DisabledLabel = styled(Body)`
	color: ${({ theme }) => theme.colors.extended.grey[600]}!important;
	font-size: 1.25rem;
	font-weight: 700;
	font-style: italic;
`

const Precisions = styled.span`
	display: block;
	font-family: ${({ theme }) => theme.fonts.main};
	font-weight: normal;
	font-size: 1rem;
	color: ${({ theme }) => theme.colors.extended.grey[700]};
	margin: 0;
	margin-top: 0.5rem;
	width: 100%;
`

export default DetailsRowCards
