import { updateSituation } from 'Actions/actions'
import { DottedName } from 'modele-social'
import { UNSAFE_isNotApplicable } from 'publicodes'
import { useDispatch, useSelector } from 'react-redux'
import { situationSelector } from 'Selectors/simulationSelectors'
import RuleInput, { RuleInputProps } from './conversation/RuleInput'
import { useEngine } from './utils/EngineContext'
import Animate from 'Components/ui/animate'
import { useState, useEffect, createContext, useContext } from 'react'

type SimulationGoalsProps = {
	className?: string
	children: React.ReactNode
}

const InitialRenderContext = createContext(false)

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
} & Omit<RuleInputProps, 'onChange'>

export function SimulationGoal({
	dottedName,
	...otherProps
}: SimulationGoalProps) {
	const dispatch = useDispatch()
	const engine = useEngine()
	const situation = useSelector(situationSelector)
	const isNotApplicable = UNSAFE_isNotApplicable(engine, dottedName)
	const evaluation = engine.evaluate(dottedName)
	const rule = engine.getRule(dottedName)
	const initialRender = useContext(InitialRenderContext)
	if (
		isNotApplicable === true ||
		(!(dottedName in situation) &&
			evaluation.nodeValue === false &&
			!(dottedName in evaluation.missingVariables))
	) {
		return null
	}

	return (
		<li>
			<Animate.appear unless={initialRender}>
				<div className="main">
					<div className="header">
						<label htmlFor={dottedName}>
							<span className="optionTitle">
								{rule.rawNode.question || rule.title}
							</span>
							<p className="ui__ notice">{rule.rawNode.résumé}</p>
						</label>
					</div>
					<div className="targetInputOrValue">
						<RuleInput
							className="targetInput"
							isTarget
							dottedName={dottedName}
							onChange={(x) => dispatch(updateSituation(dottedName, x))}
							useSwitch
						/>
					</div>
				</div>
			</Animate.appear>
		</li>
	)
}
