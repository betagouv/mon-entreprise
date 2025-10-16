import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { styled } from 'styled-components'

import { ForceThemeProvider } from '@/components/utils/DarkModeContext'
import { Body, Grid } from '@/design-system'
import { ValeurPublicodes } from '@/domaine/engine/PublicodesAdapter'
import { DottedName } from '@/domaine/publicodes/DottedName'
import { useInitialRender } from '@/hooks/useInitialRender'
import { ajusteLaSituation } from '@/store/actions/actions'
import { getMeta } from '@/utils/publicodes'

import { ExplicableRule } from '../conversation/Explicable'
import RuleInput from '../conversation/RuleInput'
import LectureGuide from '../LectureGuide'
import { Appear } from '../ui/animate'
import { useEngine } from '../utils/EngineContext'

type SimulationGoalProps = {
	dottedName: DottedName
	label?: string
	originalUnit?: boolean
}

export function AssistantGoal({
	dottedName,
	label,
	originalUnit = false,
}: SimulationGoalProps) {
	const dispatch = useDispatch()
	const engine = useEngine()
	const evaluation = engine.evaluate({
		valeur: dottedName,
	})
	const rule = engine.getRule(dottedName)
	const meta = getMeta<{ requis?: 'oui' | 'non' }>(rule.rawNode, {})
	const initialRender = useInitialRender()
	const onChange = useCallback(
		(x?: ValeurPublicodes) => {
			dispatch(
				ajusteLaSituation({ [dottedName]: x } as Record<
					DottedName,
					ValeurPublicodes
				>)
			)
		},
		[dispatch, dottedName]
	)
	if (evaluation.nodeValue === null) {
		return null
	}

	const required = meta.requis === 'oui'

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
									{label || rule.title}
									{required && <RedSpan aria-hidden>&nbsp;*</RedSpan>}
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
						<RuleInput
							dottedName={dottedName}
							displayedUnit={originalUnit ? undefined : '€'}
							missing={dottedName in evaluation.missingVariables}
							onChange={onChange}
							showSuggestions={false}
							aria-labelledby={`${dottedName.replace(/\s|\./g, '_')}-title`}
							aria-describedby={`${dottedName.replace(
								/\s|\./g,
								'_'
							)}-description`}
							required={required}
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
const RedSpan = styled.span`
	color: ${({ theme }) =>
		theme.darkMode ? '' : theme.colors.extended.error[400]};
`
