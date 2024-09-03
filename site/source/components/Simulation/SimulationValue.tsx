import { DottedName } from 'modele-social'
import { formatValue } from 'publicodes'
import React from 'react'
import { useSelector } from 'react-redux'
import { styled } from 'styled-components'

import { Grid } from '@/design-system/layout'
import { Body } from '@/design-system/typography/paragraphs'
import { targetUnitSelector } from '@/store/selectors/simulationSelectors'

import RuleLink from '../RuleLink'
import { Appear } from '../ui/animate'
import AnimatedTargetValue from '../ui/AnimatedTargetValue'
import { useEngine } from '../utils/EngineContext'
import { useInitialRender } from '../utils/useInitialRender'

type SimulationValueProps = {
	dottedName: DottedName
	label?: React.ReactNode
	appear?: boolean
	isTypeBoolean?: boolean
	isInfoMode?: boolean
	displayedUnit?: string
	round?: boolean
}

export function SimulationValue({
	dottedName,
	label,
	displayedUnit = '€',
	round = true,
	appear = true,
	isTypeBoolean = false, // TODO : remove when type inference works in publicodes
	isInfoMode = false,
}: SimulationValueProps) {
	const engine = useEngine()
	const currentUnit = useSelector(targetUnitSelector)
	const evaluation = engine.evaluate({
		valeur: dottedName,
		arrondi: round ? 'oui' : 'non',
		...(!isTypeBoolean ? { unité: currentUnit } : {}),
	})
	const initialRender = useInitialRender()
	if (evaluation.nodeValue === null) {
		return null
	}
	if (evaluation.nodeValue === undefined) {
		return null
	}
	const rule = engine.getRule(dottedName)
	const elementIdPrefix = dottedName.replace(/\s|\./g, '_')

	return (
		<Appear unless={!appear || initialRender}>
			<StyledValue>
				<Grid
					container
					style={{
						alignItems: 'baseline',
						justifyContent: 'space-between',
					}}
					spacing={2}
				>
					<Grid item md="auto" sm={9} xs={8}>
						{isInfoMode ? (
							<RuleLink id={`${elementIdPrefix}-label`} dottedName={dottedName}>
								{label || rule.title}
							</RuleLink>
						) : (
							<StyledBody id={`${elementIdPrefix}-label`}>
								{label || rule.title}
							</StyledBody>
						)}
					</Grid>

					<StyledGuideLectureContainer item md>
						<StyledGuideLecture />
					</StyledGuideLectureContainer>

					<Grid item>
						<AnimatedTargetValue value={evaluation.nodeValue as number} />
						<StyledBody id={`${elementIdPrefix}-value`}>
							{formatValue(evaluation, {
								displayedUnit,
								precision: round ? 0 : 2,
							})}
						</StyledBody>
					</Grid>
				</Grid>
			</StyledValue>
		</Appear>
	)
}

const StyledGuideLectureContainer = styled(Grid)`
	display: none;

	@media (min-width: ${({ theme }) => theme.breakpointsWidth.md}) {
		display: block;
	}
`

const StyledGuideLecture = styled.div.attrs({ 'aria-hidden': true })`
	border-bottom: 1px dashed
		${({ theme }) =>
			theme.darkMode
				? theme.colors.extended.grey[100]
				: theme.colors.extended.grey[700]};
	align-self: baseline;
	opacity: 50%;
	flex: 1;
`

const StyledValue = styled.div`
	position: relative;
	z-index: 1;
	padding: ${({ theme }) => theme.spacings.xxs} 0;

	@media print {
		padding: 0;
	}
`

const StyledBody = styled(Body)`
	color: ${({ theme }) => theme.colors.extended.grey[100]};
	margin: 0;
	padding: ${({ theme }) => `${theme.spacings.xs} ${theme.spacings.sm} 0 0`};
`
