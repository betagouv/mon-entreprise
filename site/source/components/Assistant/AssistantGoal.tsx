import { DottedName } from 'modele-social'
import { PublicodesExpression } from 'publicodes'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { styled } from 'styled-components'

import { ForceThemeProvider } from '@/components/utils/DarkModeContext'
import { Grid } from '@/design-system/layout'
import { Body } from '@/design-system/typography/paragraphs'
import { SimpleRuleEvaluation } from '@/domaine/engine/SimpleRuleEvaluation'
import { useInitialRender } from '@/hooks/useInitialRender'
import { ajusteLaSituation } from '@/store/actions/actions'

import { ExplicableRule } from '../conversation/Explicable'
import RuleInput from '../conversation/RuleInput'
import LectureGuide from '../LectureGuide'
import { Appear } from '../ui/animate'
import { useEngine } from '../utils/EngineContext'

type SimulationGoalProps = {
	dottedName: DottedName
	label?: string
	originalUnit?: boolean
	required?: boolean
}

export function AssistantGoal({
	dottedName,
	label,
	originalUnit = false,
	required,
}: SimulationGoalProps) {
	const dispatch = useDispatch()
	const { t } = useTranslation()
	const engine = useEngine()
	const evaluation = engine.evaluate({
		valeur: dottedName,
	})
	const rule = engine.getRule(dottedName)
	const initialRender = useInitialRender()
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
									{label || rule.title}
									{required && (
										<>
											<span aria-hidden>&nbsp;*</span>
											<span className="sr-only">
												&nbsp;({t('champ obligatoire')})
											</span>
										</>
									)}
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
