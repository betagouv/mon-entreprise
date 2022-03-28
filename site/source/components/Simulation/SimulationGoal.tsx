import { Grid } from '@mui/material'
import { updateSituation } from '@/actions/actions'
import { SmallBody } from '@/design-system/typography/paragraphs'
import { DottedName } from 'modele-social'
import { formatValue, UNSAFE_isNotApplicable } from 'publicodes'
import React, { useCallback, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
	situationSelector,
	targetUnitSelector,
} from '@/selectors/simulationSelectors'
import styled from 'styled-components'
import RuleInput, { InputProps } from '../conversation/RuleInput'
import RuleLink from '../RuleLink'
import { Appear } from '../ui/animate'
import AnimatedTargetValue from '../ui/AnimatedTargetValue'
import { useEngine } from '../utils/EngineContext'
import { useInitialRender } from '../utils/useInitialRender'

type SimulationGoalProps = {
	dottedName: DottedName
	label?: React.ReactNode
	small?: boolean
	appear?: boolean
	editable?: boolean
	isTypeBoolean?: boolean

	alwaysShow?: boolean
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
	alwaysShow = false,
	editable = true,
	isTypeBoolean = false, //TODO : remove when type inference works in publicodes
}: SimulationGoalProps) {
	const dispatch = useDispatch()
	const engine = useEngine()
	const currentUnit = useSelector(targetUnitSelector)
	const situation = useSelector(situationSelector)
	const isNotApplicable = UNSAFE_isNotApplicable(engine, dottedName)
	const evaluation = engine.evaluate({
		valeur: dottedName,
		...(!isTypeBoolean ? { unité: currentUnit, arrondi: 'oui' } : {}),
	})
	const rule = engine.getRule(dottedName)
	const initialRender = useInitialRender()
	const [isFocused, setFocused] = useState(false)
	const onChange = useCallback(
		(x) => {
			dispatch(updateSituation(dottedName, x))
			onUpdateSituation?.(dottedName, x)
		},
		[dispatch, onUpdateSituation, dottedName]
	)
	if (
		!alwaysShow &&
		(isNotApplicable === true ||
			(!(dottedName in situation) &&
				evaluation.nodeValue === false &&
				!(dottedName in evaluation.missingVariables)))
	) {
		return null
	}
	if (
		small &&
		!editable &&
		(evaluation.nodeValue === null || evaluation.nodeValue === undefined)
	) {
		return null
	}

	return (
		<Appear unless={!appear || initialRender}>
			<StyledGoal>
				<Grid
					container
					alignItems="baseline"
					spacing={2}
					justifyContent="space-between"
				>
					<Grid item md="auto" sm={small ? 9 : 8} xs={8}>
						<StyledGoalHeader>
							<RuleLink dottedName={dottedName}>{label}</RuleLink>

							<SmallBody
								css={`
									margin-bottom: 0;
								`}
								className={small ? 'sr-only' : ''}
								id={`${dottedName}-description`}
							>
								{rule.rawNode.résumé}
							</SmallBody>
						</StyledGoalHeader>
					</Grid>
					<Grid
						item
						md
						sx={{ display: { sm: 'none', xs: 'none', md: 'block' } }}
					>
						<StyledGuideLecture small={small} />
					</Grid>
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
								aria-labelledby={`${dottedName}-label`}
								aria-describedby={`${dottedName}-description`}
								displayedUnit=""
								dottedName={dottedName}
								onFocus={() => setFocused(true)}
								onBlur={() => setFocused(false)}
								onChange={onChange}
								small={small}
								formatOptions={{
									maximumFractionDigits: 0,
								}}
							/>
						</Grid>
					) : (
						<Grid item>
							<RuleLink dottedName={dottedName} excludeFromTabOrder>
								{formatValue(evaluation, { displayedUnit: '€' })}
							</RuleLink>
						</Grid>
					)}
				</Grid>
			</StyledGoal>
		</Appear>
	)
}
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
