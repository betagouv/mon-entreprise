import Engine, { formatValue } from 'publicodes'
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

import { BestOption, getBestOption } from '../utils'
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
	const assimiléValue = formatValue(assimiléEvaluation, {
		precision: 0,
	}) as string

	const indépendantEvaluation = indépendantEngine.evaluate({
		valeur: dottedName,
		...(unit && { unité: unit }),
	})
	const indépendantValue = formatValue(indépendantEvaluation, {
		precision: 0,
	}) as string
	const autoEntrepreneurEvaluation = autoEntrepreneurEngine.evaluate({
		valeur: dottedName,
		...(unit && { unité: unit }),
	})

	const autoEntrepreneurValue = formatValue(autoEntrepreneurEvaluation, {
		precision: 0,
	}) as string

	const options: BestOption[] = [
		{
			type: 'sasu',
			value: assimiléEvaluation.nodeValue,
		},
		{
			type: 'ei',
			value: indépendantEvaluation.nodeValue,
		},
		{
			type: 'ae',
			value: autoEntrepreneurEvaluation.nodeValue,
		},
	]

	const bestOptionValue = bestOption ?? getBestOption(options)

	if (
		assimiléValue === indépendantValue &&
		indépendantValue === autoEntrepreneurValue
	) {
		return (
			<Grid container spacing={4}>
				<Grid item xs={12} lg={12}>
					<StatusCard
						status={['sasu', 'ei', 'ae']}
						footerContent={footers?.sasu}
					>
						<WhenNotApplicable dottedName={dottedName} engine={assimiléEngine}>
							<DisabledLabel>Ne s'applique pas</DisabledLabel>
						</WhenNotApplicable>
						<WhenApplicable dottedName={dottedName} engine={assimiléEngine}>
							<StyledDiv>
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
								<StyledRuleLink
									documentationPath="/simulateurs/comparaison-régimes-sociaux/SASU"
									dottedName={dottedName}
									engine={assimiléEngine}
								>
									<HelpIcon />
								</StyledRuleLink>
								{warnings?.sasu && warnings?.sasu}
							</StyledDiv>
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
							{!evolutionDottedName && evolutionLabel && (
								<Precisions>{evolutionLabel}</Precisions>
							)}
						</WhenApplicable>
					</StatusCard>
				</Grid>
			</Grid>
		)
	}

	if (assimiléValue === indépendantValue) {
		return (
			<Grid container spacing={4}>
				<Grid item xs={12} lg={8}>
					<StatusCard
						status={['sasu', 'ei']}
						isBestOption={bestOptionValue === 'sasu'}
						footerContent={footers?.sasu}
					>
						<WhenNotApplicable dottedName={dottedName} engine={assimiléEngine}>
							<DisabledLabel>Ne s'applique pas</DisabledLabel>
						</WhenNotApplicable>
						<WhenApplicable dottedName={dottedName} engine={assimiléEngine}>
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
							<StyledRuleLink
								documentationPath="/simulateurs/comparaison-régimes-sociaux/SASU"
								dottedName={dottedName}
								engine={assimiléEngine}
							>
								<HelpIcon />
							</StyledRuleLink>
							{warnings?.sasu || warnings?.ei
								? warnings?.sasu
									? warnings?.sasu
									: warnings?.ei
								: ''}
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
							{!evolutionDottedName && evolutionLabel && (
								<Precisions>{evolutionLabel}</Precisions>
							)}
						</WhenApplicable>
					</StatusCard>
				</Grid>
				<Grid item xs={12} lg={4}>
					<StatusCard
						status={['ae']}
						footerContent={footers?.ei}
						isBestOption={bestOptionValue === 'ae'}
					>
						<WhenNotApplicable
							dottedName={dottedName}
							engine={autoEntrepreneurEngine}
						>
							<DisabledLabel>Ne s'applique pas</DisabledLabel>
						</WhenNotApplicable>
						<WhenApplicable
							dottedName={dottedName}
							engine={autoEntrepreneurEngine}
						>
							<span>
								<Value
									linkToRule={false}
									expression={dottedName}
									engine={autoEntrepreneurEngine}
									precision={0}
									unit={unit}
								/>
								{label && ' '}
								{label && label}
							</span>
							<StyledRuleLink
								documentationPath="/simulateurs/comparaison-régimes-sociaux/auto-entrepreneur"
								dottedName={dottedName}
								engine={autoEntrepreneurEngine}
							>
								<HelpIcon />
							</StyledRuleLink>
							{warnings?.ae && warnings?.ae}
							{evolutionDottedName && (
								<Precisions>
									<Value
										linkToRule={false}
										expression={evolutionDottedName}
										engine={autoEntrepreneurEngine}
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
						isBestOption={bestOptionValue === 'sasu'}
					>
						<WhenNotApplicable dottedName={dottedName} engine={assimiléEngine}>
							<DisabledLabel>Ne s'applique pas</DisabledLabel>
						</WhenNotApplicable>
						<WhenApplicable dottedName={dottedName} engine={assimiléEngine}>
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
							<StyledRuleLink
								dottedName={dottedName}
								engine={assimiléEngine}
								documentationPath="/simulateurs/comparaison-régimes-sociaux/SASU"
							>
								<HelpIcon />
							</StyledRuleLink>
							{warnings?.sasu && warnings?.sasu}
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
							{!evolutionDottedName && evolutionLabel && (
								<Precisions>{evolutionLabel}</Precisions>
							)}
						</WhenApplicable>
					</StatusCard>
				</Grid>
				<Grid item xs={12} lg={8}>
					<StatusCard
						status={['ei', 'ae']}
						footerContent={footers?.ei}
						isBestOption={bestOptionValue === 'ei'}
					>
						<WhenNotApplicable
							dottedName={dottedName}
							engine={indépendantEngine}
						>
							<DisabledLabel>Ne s'applique pas</DisabledLabel>
						</WhenNotApplicable>
						<WhenApplicable dottedName={dottedName} engine={indépendantEngine}>
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
								documentationPath="/simulateurs/comparaison-régimes-sociaux/EI"
							>
								<HelpIcon />
							</StyledRuleLink>
							{warnings?.ei || warnings?.ae
								? warnings?.ei
									? warnings?.ei
									: warnings?.ae
								: ''}
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
							{!evolutionDottedName && evolutionLabel && (
								<Precisions>{evolutionLabel}</Precisions>
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
					isBestOption={bestOptionValue === 'sasu'}
				>
					<WhenNotApplicable dottedName={dottedName} engine={assimiléEngine}>
						<DisabledLabel>Ne s'applique pas</DisabledLabel>
					</WhenNotApplicable>
					<WhenApplicable dottedName={dottedName} engine={assimiléEngine}>
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
						<StyledRuleLink
							dottedName={dottedName}
							engine={assimiléEngine}
							documentationPath="/simulateurs/comparaison-régimes-sociaux/SASU"
						>
							<HelpIcon />
						</StyledRuleLink>
						{warnings?.sasu && warnings?.sasu}
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
						{!evolutionDottedName && evolutionLabel && (
							<Precisions>{evolutionLabel}</Precisions>
						)}
					</WhenApplicable>
				</StatusCard>
			</Grid>
			<Grid item xs={12} lg={4}>
				<StatusCard
					status={['ei']}
					footerContent={footers?.ei}
					isBestOption={bestOptionValue === 'ei'}
				>
					<WhenNotApplicable dottedName={dottedName} engine={indépendantEngine}>
						<DisabledLabel>Ne s'applique pas</DisabledLabel>
					</WhenNotApplicable>
					<WhenApplicable dottedName={dottedName} engine={indépendantEngine}>
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
							documentationPath="/simulateurs/comparaison-régimes-sociaux/EI"
						>
							<HelpIcon />
						</StyledRuleLink>
						{warnings?.ei && warnings?.ei}
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
						{!evolutionDottedName && evolutionLabel && (
							<Precisions>{evolutionLabel}</Precisions>
						)}
					</WhenApplicable>
				</StatusCard>
			</Grid>
			<Grid item xs={12} lg={4}>
				<StatusCard
					status={['ae']}
					footerContent={footers?.ae}
					isBestOption={bestOptionValue === 'ae'}
				>
					<WhenNotApplicable
						dottedName={dottedName}
						engine={autoEntrepreneurEngine}
					>
						<DisabledLabel>Ne s'applique pas</DisabledLabel>
					</WhenNotApplicable>
					<WhenApplicable
						dottedName={dottedName}
						engine={autoEntrepreneurEngine}
					>
						<span>
							<Value
								linkToRule={false}
								expression={dottedName}
								engine={autoEntrepreneurEngine}
								precision={0}
								unit={unit}
							/>
							{label && ' '}
							{label && label}
						</span>
						<StyledRuleLink
							dottedName={dottedName}
							engine={autoEntrepreneurEngine}
							documentationPath="/simulateurs/comparaison-régimes-sociaux/auto-entrepreneur"
						>
							<HelpIcon />
						</StyledRuleLink>
						{warnings?.ae && warnings?.ae}
						{evolutionDottedName && (
							<Precisions>
								<Value
									linkToRule={false}
									expression={evolutionDottedName}
									engine={autoEntrepreneurEngine}
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
