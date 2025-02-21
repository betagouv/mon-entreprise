import { DottedName } from 'modele-social'
import { formatValue, PublicodesExpression } from 'publicodes'
import React, { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { styled } from 'styled-components'

import { ForceThemeProvider } from '@/components/utils/DarkModeContext'
import { Grid } from '@/design-system/layout'
import { Strong } from '@/design-system/typography'
import { Body, SmallBody } from '@/design-system/typography/paragraphs'
import { SimpleRuleEvaluation } from '@/domaine/engine/SimpleRuleEvaluation'
import { useInitialRender } from '@/hooks/useInitialRender'
import { ajusteLaSituation } from '@/store/actions/actions'
import { targetUnitSelector } from '@/store/selectors/simulationSelectors'

import { ExplicableRule } from '../conversation/Explicable'
import RuleInput, { InputProps } from '../conversation/RuleInput'
import LectureGuide from '../LectureGuide'
import RuleLink from '../RuleLink'
import { Appear } from '../ui/animate'
import AnimatedTargetValue from '../ui/AnimatedTargetValue'
import { useEngine } from '../utils/EngineContext'

type SimulationGoalProps = {
	dottedName: DottedName
	label?: React.ReactNode
	small?: boolean
	appear?: boolean
	editable?: boolean
	isTypeBoolean?: boolean
	displayedUnit?: string
	isInfoMode?: boolean
	round?: boolean
	onUpdateSituation?: (
		name: DottedName,
		...rest: Parameters<InputProps['onChange']>
	) => void
}

export function SimulationGoal({
	dottedName,
	label,
	onUpdateSituation,
	displayedUnit = '€',
	small = false,
	round = true,
	appear = true,
	editable = true,
	isTypeBoolean = false, // TODO : remove when type inference works in publicodes
	isInfoMode = false,
}: SimulationGoalProps) {
	const dispatch = useDispatch()
	const engine = useEngine()
	const currentUnit = useSelector(targetUnitSelector)
	const language = useTranslation().i18n.language
	const evaluation = engine.evaluate({
		valeur: dottedName,
		arrondi: round ? 'oui' : 'non',
		...(!isTypeBoolean ? { unité: currentUnit } : {}),
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
			<StyledGoal $small={small && !editable}>
				<Grid
					container
					style={{
						alignItems: 'baseline',
						justifyContent: 'space-between',
					}}
					spacing={2}
				>
					<Grid item md="auto" sm={small ? 9 : 8} xs={8}>
						<div>
							{isInfoMode ? (
								<Grid
									container
									style={{
										alignItems: 'center',
									}}
								>
									<Grid item>
										<StyledBody
											id={`${dottedName.replace(/\s|\./g, '_')}-label`}
										>
											<Strong>{label || rule.title}</Strong>
										</StyledBody>
									</Grid>
									<Grid item>
										<ForceThemeProvider forceTheme="default">
											<ExplicableRule dottedName={dottedName} light />
										</ForceThemeProvider>
									</Grid>
								</Grid>
							) : (
								<RuleLink
									id={`${dottedName.replace(/\s|\./g, '_')}-label`}
									dottedName={dottedName}
								>
									{label || rule.title}
								</RuleLink>
							)}

							{rule.rawNode.résumé && (
								<StyledSmallBody
									className={small ? 'sr-only' : ''}
									id={`${dottedName.replace(/\s|\./g, '_')}-description`}
								>
									{rule.rawNode.résumé}
								</StyledSmallBody>
							)}
						</div>
					</Grid>
					<LectureGuide />
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
										  }
										: undefined
								}
								aria-label={engine.getRule(dottedName)?.title}
								aria-describedby={`${dottedName.replace(
									/\s|\./g,
									'_'
								)}-description`}
								aria-labelledby="simu-update-explaining"
								hideDefaultValue
								displayedUnit={displayedUnit}
								dottedName={dottedName}
								onFocus={() => setFocused(true)}
								onBlur={() => setFocused(false)}
								onChange={onChange}
								missing={dottedName in evaluation.missingVariables}
								small={small}
								formatOptions={{
									maximumFractionDigits: round ? 0 : 2,
								}}
							/>
						</Grid>
					) : (
						<Grid item>
							<Body id={`${dottedName.replace(/\s|\./g, '_')}-value`}>
								{formatValue(evaluation, {
									displayedUnit,
									precision: round ? 0 : 2,
									language,
								})}
							</Body>
						</Grid>
					)}
				</Grid>
			</StyledGoal>
		</Appear>
	)
}

const StyledGoal = styled.div<{ $small: boolean }>`
	position: relative;
	z-index: 1;
	padding: ${({ theme, $small }) => theme.spacings[$small ? 'xxs' : 'sm']} 0;

	@media print {
		padding: 0;
	}
`

const StyledSmallBody = styled(SmallBody)`
	margin-bottom: 0;
`
const StyledBody = styled(Body)`
	color: ${({ theme }) => theme.colors.extended.grey[100]};
	margin: 0;
`
