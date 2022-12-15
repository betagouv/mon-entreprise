import { DottedName } from 'modele-social'
import { PublicodesExpression, formatValue } from 'publicodes'
import React, { useCallback, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'

import { updateSituation } from '@/actions/actions'
import { Grid } from '@/design-system/layout'
import { Body, SmallBody } from '@/design-system/typography/paragraphs'
import { targetUnitSelector } from '@/selectors/simulationSelectors'

import RuleLink from '../RuleLink'
import RuleInput, { InputProps } from '../conversation/RuleInput'
import AnimatedTargetValue from '../ui/AnimatedTargetValue'
import { Appear } from '../ui/animate'
import { useEngine } from '../utils/EngineContext'
import { useInitialRender } from '../utils/useInitialRender'

type SimulationGoalProps = {
	dottedName: DottedName
	label?: React.ReactNode
	small?: boolean
	appear?: boolean
	editable?: boolean
	isTypeBoolean?: boolean

	onUpdateSituation?: (
		name: DottedName,
		...rest: Parameters<InputProps['onChange']>
	) => void
}

export function SimulationGoal({
	dottedName,
	label,
	small = false,
	onUpdateSituation,
	appear = true,
	editable = true,
	isTypeBoolean = false, // TODO : remove when type inference works in publicodes
}: SimulationGoalProps) {
	const dispatch = useDispatch()
	const engine = useEngine()
	const currentUnit = useSelector(targetUnitSelector)
	const evaluation = engine.evaluate({
		valeur: dottedName,
		...(!isTypeBoolean ? { unité: currentUnit, arrondi: 'oui' } : {}),
	})
	const rule = engine.getRule(dottedName)
	const initialRender = useInitialRender()
	const [isFocused, setFocused] = useState(false)
	const onChange = useCallback(
		(x?: PublicodesExpression) => {
			dispatch(updateSituation(dottedName, x))
			onUpdateSituation?.(dottedName, x)
		},
		[dispatch, onUpdateSituation, dottedName]
	)
	if (evaluation.nodeValue === null) {
		return null
	}
	if (small && !editable && evaluation.nodeValue === undefined) {
		return null
	}

	return (
		<Appear unless={!appear || initialRender}>
			<StyledGoal>
				<Grid
					container
					css={`
						align-items: baseline;
						justify-content: space-between;
					`}
					spacing={2}
				>
					<Grid item md="auto" sm={small ? 9 : 8} xs={8}>
						<StyledGoalHeader>
							<StyledRuleLink
								id={`${dottedName.replace(/\s|\./g, '')}-label`}
								dottedName={dottedName}
							>
								{label}
							</StyledRuleLink>

							{rule.rawNode.résumé && (
								<StyledSmallBody
									className={small ? 'sr-only' : ''}
									id={`${dottedName.replace(/\s|\./g, '')}-description`}
								>
									{rule.rawNode.résumé}
								</StyledSmallBody>
							)}
						</StyledGoalHeader>
					</Grid>
					<StyledGuideLectureContainer>
						<StyledGuideLecture small={small} />
					</StyledGuideLectureContainer>
					{editable ? (
						<Grid item md={small ? 2 : 3} sm={small ? 3 : 4} xs={4}>
							{!isFocused && !small && (
								<AnimatedTargetValue value={evaluation.nodeValue as number} />
							)}
							<RuleInput
								modifiers={
									!isTypeBoolean
										? {
												unité: currentUnit,
												arrondi: 'oui',
										  }
										: undefined
								}
								aria-label={engine.getRule(dottedName)?.title}
								aria-describedby={`${dottedName.replace(
									/\s|\./g,
									''
								)}-description`}
								displayedUnit="€"
								dottedName={dottedName}
								onFocus={() => setFocused(true)}
								onBlur={() => setFocused(false)}
								onChange={onChange}
								missing={dottedName in evaluation.missingVariables}
								small={small}
								formatOptions={{
									maximumFractionDigits: 0,
								}}
							/>
						</Grid>
					) : (
						<Grid item>
							<Body>{formatValue(evaluation, { displayedUnit: '€' })}</Body>
						</Grid>
					)}
				</Grid>
			</StyledGoal>
		</Appear>
	)
}

const StyledGuideLectureContainer = styled(Grid).attrs({
	item: true,
	md: true,
})`
	display: none;

	@media (min-width: ${({ theme }) => theme.breakpointsWidth.md}) {
		display: block;
	}
`

const StyledGuideLecture = styled.div.attrs({ 'aria-hidden': true })<{
	small: boolean
}>`
	border-bottom: 1px dashed ${({ theme }) => theme.colors.extended.grey[100]};
	align-self: baseline;
	opacity: 50%;
	flex: 1;
`
const StyledGoalHeader = styled.div``

const StyledGoal = styled.div`
	position: relative;
	z-index: 1;
	padding: ${({ theme }) => theme.spacings.sm} 0;
	@media print {
		padding: 0;
	}
`

const StyledRuleLink = styled(RuleLink)`
	color: ${({ theme }) => theme.colors.bases.primary[100]};
`

const StyledSmallBody = styled(SmallBody)`
	margin-bottom: 0;
	color: ${({ theme }) => theme.colors.bases.primary[100]};
`
