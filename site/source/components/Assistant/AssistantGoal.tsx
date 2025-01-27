import { DottedName } from 'modele-social'
import { PublicodesExpression } from 'publicodes'
import { useCallback, useState } from 'react'
import { useDispatch } from 'react-redux'
import { styled } from 'styled-components'

import { ForceThemeProvider } from '@/components/utils/DarkModeContext'
import { Grid } from '@/design-system/layout'
import { Body } from '@/design-system/typography/paragraphs'
import { SimpleRuleEvaluation } from '@/domaine/engine/SimpleRuleEvaluation'
import { ajusteLaSituation } from '@/store/actions/actions'

import { ExplicableRule } from '../conversation/Explicable'
import RuleInput from '../conversation/RuleInput'
import LectureGuide from '../LectureGuide'
import { Appear } from '../ui/animate'
import AnimatedTargetValue from '../ui/AnimatedTargetValue'
import { useEngine } from '../utils/EngineContext'
import { useInitialRender } from '../utils/useInitialRender'

type SimulationGoalProps = {
	dottedName: DottedName
	originalUnit?: boolean
}

export function AssistantGoal({
	dottedName,
	originalUnit = false,
}: SimulationGoalProps) {
	const dispatch = useDispatch()
	const engine = useEngine()
	const evaluation = engine.evaluate({
		valeur: dottedName,
	})
	const rule = engine.getRule(dottedName)
	const initialRender = useInitialRender()
	const [isFocused, setFocused] = useState(false)
	const onChange = useCallback(
		(x?: PublicodesExpression) => {
			dispatch(
				ajusteLaSituation({ [dottedName]: x } as Record<
					DottedName,
					SimpleRuleEvaluation
				>)
			)
		},
		[dispatch, dottedName]
	)
	if (evaluation.nodeValue === null) {
		return null
	}

	return (
		<Appear unless={initialRender}>
			<StyledGoal>
				<Grid
					container
					style={{
						alignItems: 'baseline',
						justifyContent: 'space-between',
					}}
					spacing={2}
				>
					<Grid item md="auto" sm={8} xs={8}>
						<Grid
							container
							style={{
								alignItems: 'center',
							}}
						>
							<Grid item>
								<StyledBody id={`${dottedName.replace(/\s|\./g, '_')}-title`}>
									{rule.title}
								</StyledBody>
							</Grid>
							<Grid item>
								<ForceThemeProvider forceTheme="default">
									<ExplicableRule dottedName={dottedName} light />
								</ForceThemeProvider>
							</Grid>
						</Grid>
					</Grid>
					<LectureGuide />
					<Grid item md={3} sm={4} xs={4}>
						{!isFocused && (
							<AnimatedTargetValue value={evaluation.nodeValue as number} />
						)}
						<RuleInput
							dottedName={dottedName}
							displayedUnit={originalUnit ? undefined : '€'}
							missing={dottedName in evaluation.missingVariables}
							onChange={onChange}
							onFocus={() => setFocused(true)}
							onBlur={() => setFocused(false)}
							showSuggestions={false}
							aria-labelledby={`${dottedName.replace(/\s|\./g, '_')}-title`}
							aria-describedby={`${dottedName.replace(
								/\s|\./g,
								'_'
							)}-description`}
						/>
					</Grid>
				</Grid>
			</StyledGoal>
		</Appear>
	)
}

const StyledGoal = styled.div`
	position: relative;
	z-index: 1;
	margin: ${({ theme }) => theme.spacings.xxs} 0;
`

const StyledBody = styled(Body)`
	margin: 0;
	font-size: 1.125rem;
`
