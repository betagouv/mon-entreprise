import { updateSituation } from 'Actions/actions'
import classnames from 'classnames'
import Animate from 'Components/ui/animate'
import { DottedName } from 'modele-social'
import { formatValue, UNSAFE_isNotApplicable } from 'publicodes'
import { createContext, useContext, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { situationSelector } from 'Selectors/simulationSelectors'
import RuleInput from './conversation/RuleInput'
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
			<section className={`ui__ card ${className}`}>
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
	labelWithTitle?: boolean
	small?: boolean
	appear?: boolean
	editable?: boolean
}

export function SimulationGoal({
	dottedName,
	labelWithTitle = false,
	small = false,
	appear = true,
	editable = true,
}: SimulationGoalProps) {
	const dispatch = useDispatch()
	const engine = useEngine()
	const situation = useSelector(situationSelector)
	const isNotApplicable = UNSAFE_isNotApplicable(engine, dottedName)
	const evaluation = engine.evaluate(dottedName)
	const rule = engine.getRule(dottedName)
	const initialRender = useContext(InitialRenderContext)
	const [isFocused, setFocused] = useState(false)
	if (
		isNotApplicable === true ||
		(!(dottedName in situation) &&
			evaluation.nodeValue === false &&
			!(dottedName in evaluation.missingVariables))
	) {
		return null
	}
	const displayAsInput =
		dottedName in situation ||
		isFocused ||
		initialRender ||
		Object.keys(situation).length === 0
	return (
		<li className={small ? 'small-target' : ''}>
			<Animate.appear unless={!appear || initialRender}>
				<div className="main" style={small ? { alignItems: 'baseline' } : {}}>
					<div className="header">
						<label htmlFor={dottedName}>
							<span className="optionTitle">
								{(!labelWithTitle && rule.rawNode.question) || rule.title}
							</span>
							<p className="ui__ notice">{rule.rawNode.résumé}</p>
						</label>
					</div>
					{small && <span className="guide-lecture" />}
					<div className="targetInputOrValue">
						{editable ? (
							<>
								<RuleInput
									className={classnames(
										displayAsInput ? 'targetInput' : 'editableTarget',
										{ focused: isFocused }
									)}
									isTarget
									dottedName={dottedName}
									onFocus={() => setFocused(true)}
									onBlur={() => setFocused(false)}
									onChange={(x) => dispatch(updateSituation(dottedName, x))}
									useSwitch
								/>
							</>
						) : (
							<>
								<AnimatedTargetValue value={evaluation.nodeValue} />
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
							</>
						)}
					</div>
				</div>
			</Animate.appear>
		</li>
	)
}
