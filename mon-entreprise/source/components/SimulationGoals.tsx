import { updateSituation } from 'Actions/actions'
import classnames from 'classnames'
import { DottedName } from 'modele-social'
import { formatValue, UNSAFE_isNotApplicable } from 'publicodes'
import {
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
import RuleInput, { InputProps } from './conversation/RuleInput'
import RuleLink from './RuleLink'
import { Appear } from './ui/animate'
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
	const [initialRender, setInitialRender] = useState(true)
	useEffect(() => {
		setInitialRender(false)
	}, [])

	return (
		<InitialRenderContext.Provider value={initialRender}>
			<section
				className={`ui__ card ${className}`}
				style={{ marginTop: '0.6rem' }}
			>
				<div id="objectifSelection">
					<ul className="targets">{children}</ul>
				</div>
			</section>
		</InitialRenderContext.Provider>
	)
}

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
			<Appear unless={!appear || initialRender}>
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
								modifiers={
									!boolean
										? {
												unité: currentUnit,
												arrondi: 'oui',
										  }
										: undefined
								}
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
			</Appear>
		</li>
	)
}
