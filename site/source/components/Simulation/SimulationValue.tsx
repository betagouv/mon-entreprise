import { DottedName } from 'modele-social'
import { formatValue } from 'publicodes'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { styled } from 'styled-components'

import { Grid } from '@/design-system/layout'
import { Body } from '@/design-system/typography/paragraphs'
import { Contexte } from '@/domaine/Contexte'
import { targetUnitSelector } from '@/store/selectors/simulationSelectors'

import RuleLink from '../RuleLink'
import { Appear } from '../ui/animate'
import AnimatedTargetValue from '../ui/AnimatedTargetValue'
import { useEngine } from '../utils/EngineContext'
import { useInitialRender } from '../utils/useInitialRender'
import LectureGuide from './LectureGuide'

type SimulationValueProps = {
	dottedName: DottedName
	label?: React.ReactNode
	appear?: boolean
	isTypeBoolean?: boolean
	isInfoMode?: boolean
	displayedUnit?: string
	round?: boolean
	contexte?: Contexte
}

export function SimulationValue({
	dottedName,
	label,
	displayedUnit = '€',
	round = true,
	appear = true,
	isTypeBoolean = false, // TODO : remove when type inference works in publicodes
	isInfoMode = false,
	contexte = {},
}: SimulationValueProps) {
	const engine = useEngine()
	const currentUnit = useSelector(targetUnitSelector)
	const language = useTranslation().i18n.language
	const evaluation = engine.evaluate({
		valeur: dottedName,
		arrondi: round ? 'oui' : 'non',
		...(!isTypeBoolean ? { unité: currentUnit } : {}),
		contexte,
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

					<LectureGuide />

					<Grid item>
						<AnimatedTargetValue value={evaluation.nodeValue as number} />
						<StyledBody id={`${elementIdPrefix}-value`}>
							{formatValue(evaluation, {
								displayedUnit,
								precision: round ? 0 : 2,
								language,
							})}
						</StyledBody>
					</Grid>
				</Grid>
			</StyledValue>
		</Appear>
	)
}

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
