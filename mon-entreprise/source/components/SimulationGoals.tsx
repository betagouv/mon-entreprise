import { Grid } from '@mui/material'
import { updateSituation } from 'Actions/actions'
import { SmallBody } from 'DesignSystem/typography/paragraphs'
import { DottedName } from 'modele-social'
import { formatValue, UNSAFE_isNotApplicable } from 'publicodes'
import React, {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
	firstStepCompletedSelector,
	situationSelector,
	targetUnitSelector,
} from 'Selectors/simulationSelectors'
import styled, { css, ThemeProvider } from 'styled-components'
import RuleInput, { InputProps } from './conversation/RuleInput'
import RuleLink from './RuleLink'
import { Appear } from './ui/animate'
import AnimatedTargetValue from './ui/AnimatedTargetValue'
import { useEngine } from './utils/EngineContext'

type SimulationGoalsProps = {
	className?: string
	legend: string
	publique?:
		| 'employeur'
		| 'particulier'
		| 'artisteAuteur'
		| 'independant'
		| 'marin'
		| undefined
	children: React.ReactNode
	toggles?: React.ReactNode
}

const InitialRenderContext = createContext(true)

export function SimulationGoals({
	publique,
	legend,
	toggles,
	children,
}: SimulationGoalsProps) {
	const [initialRender, setInitialRender] = useState(true)
	useEffect(() => {
		setInitialRender(false)
	}, [])

	return (
		<InitialRenderContext.Provider value={initialRender}>
			{toggles && <ToggleSection>{toggles}</ToggleSection>}
			<StyledSimulationGoals
				publique={publique}
				role="group"
				aria-labelledby="simulator-legend"
			>
				<ThemeProvider theme={(theme) => ({ ...theme, darkMode: true })}>
					<div className="sr-only" id="simulator-legend">
						{legend}
					</div>
					{children}
				</ThemeProvider>
			</StyledSimulationGoals>
		</InitialRenderContext.Provider>
	)
}

const ToggleSection = styled.div`
	margin-bottom: ${({ theme }) => theme.spacings.md};
`

const StyledSimulationGoals = styled.div<
	Pick<SimulationGoalsProps, 'publique'>
>`
	padding: ${({ theme }) => `${theme.spacings.sm} ${theme.spacings.lg}`};
	border-radius: ${({ theme }) => theme.box.borderRadius};
	background: ${({ theme, publique }) => {
		const colorPalette = publique
			? theme.colors.publics[publique]
			: theme.colors.bases.primary
		return css`linear-gradient(60deg, ${colorPalette[800]} 0%, ${colorPalette[600]} 100%);`
	}};
`

function useInitialRender() {
	const initialRender = useContext(InitialRenderContext)
	const unChangedInitialRender = useMemo(() => initialRender, [])
	return unChangedInitialRender
}

type SimulationGoalProps = {
	dottedName: DottedName
	labelWithQuestion?: boolean
	small?: boolean
	appear?: boolean
	editable?: boolean
	boolean?: boolean
	description?: React.ReactNode

	alwaysShow?: boolean
	onUpdateSituation?: (
		name: DottedName,
		...rest: Parameters<InputProps['onChange']>
	) => void
}

export function SimulationGoal({
	dottedName,
	labelWithQuestion = false,
	small = false,
	onUpdateSituation,
	description = null,
	appear = true,
	alwaysShow = false,
	editable = true,
	boolean = false, //TODO : remove when type inference works in publicodes
}: SimulationGoalProps) {
	const dispatch = useDispatch()
	const engine = useEngine()
	const currentUnit = useSelector(targetUnitSelector)
	const situation = useSelector(situationSelector)
	const isNotApplicable = UNSAFE_isNotApplicable(engine, dottedName)
	const evaluation = engine.evaluate({
		valeur: dottedName,
		...(!boolean ? { unité: currentUnit, arrondi: 'oui' } : {}),
	})
	const rule = engine.getRule(dottedName)
	const initialRender = useInitialRender()
	const [isFocused, setFocused] = useState(false)
	const isFirstStepCompleted = useSelector(firstStepCompletedSelector)
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
	const selected = !isFirstStepCompleted || isFocused || dottedName in situation
	if (
		small &&
		!editable &&
		(evaluation.nodeValue === false || evaluation.nodeValue === null)
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
					justifyContent="flex-end"
				>
					<Grid item md="auto" sm={small ? 9 : 8} xs={12}>
						<StyledGoalHeader>
							{(labelWithQuestion && rule.rawNode.question) || (
								<RuleLink dottedName={dottedName} />
							)}
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
					<Grid item md sx={{ display: { sm: 'none', md: 'block' } }}>
						<StyledGuideLecture small={small} />
					</Grid>
					{editable ? (
						<Grid
							item
							md={small ? 2 : 3}
							sm={small ? 3 : 4}
							xs={small ? 6 : 12}
						>
							<RuleInput
								modifiers={
									!boolean
										? {
												unité: currentUnit,
												arrondi: 'oui',
										  }
										: undefined
								}
								aria-labelledby={`${dottedName}-label`}
								aria-describedBy={`${dottedName}-description`}
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
							{!isFocused && !small && (
								<span style={{ position: 'relative', top: '-1rem' }}>
									<AnimatedTargetValue value={evaluation.nodeValue as number} />
								</span>
							)}
						</Grid>
					) : (
						<Grid item md="auto">
							<RuleLink dottedName={dottedName}>
								{formatValue(evaluation, { displayedUnit: '€' })}
							</RuleLink>
						</Grid>
					)}
				</Grid>
			</StyledGoal>
		</Appear>
	)
}
const StyledInputOrValue = styled.div`
	position: relative;
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
	padding: ${({ theme }) => theme.spacings.sm} 0;
`
