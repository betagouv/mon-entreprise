import { updateSituation } from 'Actions/actions'
import classnames from 'classnames'
import Animate from 'Components/ui/animate'
import { DottedName } from 'modele-social'
import { formatValue, UNSAFE_isNotApplicable } from 'publicodes'
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState,
} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
	firstStepCompletedSelector,
	situationSelector,
	targetUnitSelector,
} from 'Selectors/simulationSelectors'
import RuleInput, { InputProps } from './conversation/RuleInput'
import RuleLink from './RuleLink'
import AnimatedTargetValue from './ui/AnimatedTargetValue'
import { useEngine } from './utils/EngineContext'

type SimulationGoalsProps = {
	className?: string
	children: React.ReactNode
}

const InitialRenderContext = createContext(true)

export function SimulationGoals({
	className = '',
	children,
}: SimulationGoalsProps) {
	const initialRender = useInitialRender()

	return (
		<InitialRenderContext.Provider value={initialRender}>
			<section
				className={`ui__ card ${className}`}
				style={{ marginTop: '0.6rem' }}
			>
				<div id="targetSelection">
					<ul className="targets">{children}</ul>
				</div>
			</section>
		</InitialRenderContext.Provider>
	)
}

function useInitialRender() {
	const [initialRender, setInitialRender] = useState(true)
	useEffect(() => {
		setInitialRender(false)
	}, [])
	return initialRender
}

type SimulationGoalProps = {
	dottedName: DottedName
	labelWithQuestion?: boolean
	small?: boolean
	appear?: boolean
	editable?: boolean
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
	appear = true,
	editable = true,
}: SimulationGoalProps) {
	const dispatch = useDispatch()
	const engine = useEngine()
	const currentUnit = useSelector(targetUnitSelector)
	const situation = useSelector(situationSelector)
	const isNotApplicable = UNSAFE_isNotApplicable(engine, dottedName)
	const evaluation = engine.evaluate({
		valeur: dottedName,
		unité: currentUnit,
		arrondi: 'oui',
	})
	const rule = engine.getRule(dottedName)
	const initialRender = useContext(InitialRenderContext)
	const [isFocused, setFocused] = useState(false)
	const isFirstStepCompleted = useSelector(firstStepCompletedSelector)
	const onChange = useCallback(
		(x) => {
			dispatch(updateSituation(dottedName, x))
			onUpdateSituation?.(dottedName, x)
		},
		[dispatch, onUpdateSituation]
	)
	if (
		isNotApplicable === true ||
		(!(dottedName in situation) &&
			evaluation.nodeValue === false &&
			!(dottedName in evaluation.missingVariables))
	) {
		return null
	}
	const displayAsInput =
		!isFirstStepCompleted || isFocused || dottedName in situation
	if (
		small &&
		!editable &&
		(evaluation.nodeValue === false || evaluation.nodeValue === null)
	) {
		return null
	}
	return (
		<li className={small ? 'small-target' : ''}>
			<Animate.appear unless={!appear || initialRender}>
				<div className="main">
					<div className="header">
						<label htmlFor={dottedName}>
							<span className="optionTitle">
								{(labelWithQuestion && rule.rawNode.question) || (
									<RuleLink dottedName={dottedName} />
								)}
							</span>
							{!small && <p className="ui__ notice">{rule.rawNode.résumé}</p>}
						</label>
					</div>
					{small && <span className="guide-lecture" />}
					<div className="targetInputOrValue">
						{editable ? (
							<RuleInput
								className={classnames(
									displayAsInput ? 'targetInput' : 'editableTarget',
									{ focused: isFocused }
								)}
								isTarget
								modifiers={{
									unité: currentUnit,
									arrondi: 'oui',
								}}
								dottedName={dottedName}
								onFocus={() => setFocused(true)}
								onBlur={() => setFocused(false)}
								onChange={onChange}
								useSwitch
							/>
						) : (
							<RuleLink
								dottedName={dottedName}
								css={`
										padding-right: 0.6rem
										&:not(:hover) {
											text-decoration: none;
										}
									`}
							>
								{formatValue(evaluation, { displayedUnit: '€' })}
							</RuleLink>
						)}
						{!isFocused && !small && (
							<span style={{ position: 'relative', top: '-1rem' }}>
								<AnimatedTargetValue value={evaluation.nodeValue as number} />
							</span>
						)}
					</div>
				</div>
			</Animate.appear>
		</li>
	)
}
