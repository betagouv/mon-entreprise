import React, { createContext, useState, useEffect, useContext } from 'react'
import { DottedName } from 'Rules/'
import { useDispatch, useSelector } from 'react-redux'
import { useEvaluation, EngineContext } from './utils/EngineContext'
import { situationSelector } from 'Selectors/simulationSelectors'
import RuleInput from './conversation/RuleInput'
import { updateSituation, setSimulationConfig } from 'Actions/actions'
import Animate from 'Components/ui/animate'
import 'Components/TargetSelection.css'
import { formatValue } from 'publicodes'
import { capitalise0 } from '../utils'

const InitialRenderContext = createContext(false)
function useInitialRender() {
	const [initialRender, setInitialRender] = useState(true)
	useEffect(() => {
		setInitialRender(false)
	}, [])
	return initialRender
}

type SimulatorProps = {
	children: React.ReactNode
	config: {}
	style?: 'light' | 'plain'
}

export function SimulatorSection({
	children,
	style = 'plain',
	config
}: SimulatorProps) {
	const dispatch = useDispatch()
	useEffect(() => {
		dispatch(setSimulationConfig(config))
	}, [dispatch])
	const initialRender = useInitialRender()

	return (
		<section className={`ui__ ${style} card`}>
			<div id="targetSelection">
				<ul className="targets">
					<InitialRenderContext.Provider value={initialRender}>
						{children}
					</InitialRenderContext.Provider>
				</ul>
			</div>
		</section>
	)
}

type FieldProps = {
	dottedName: DottedName
	editable?: boolean
}

export function Field({ dottedName, editable = true }: FieldProps) {
	const dispatch = useDispatch()
	const rule = useEvaluation(dottedName)
	const initialRender = useContext(InitialRenderContext)
	const parsedRules = useContext(EngineContext).getParsedRules()
	if (rule.isApplicable === false || rule.isApplicable === null) {
		return null
	}

	// xxx hack
	if (rule.nodeValue === null) {
		return null
	}

	return (
		<li>
			<Animate.appear unless={initialRender}>
				<div className="main">
					<div className="header">
						<label htmlFor={`step-${dottedName}`}>
							<span className="optionTitle">
								{rule.titre || capitalise0(rule.name)}
							</span>
							<p className="ui__ notice">{rule.résumé}</p>
						</label>
					</div>
					<div className="targetInputOrValue">
						{editable ? (
							<RuleInput
								className="targetInput"
								isTarget
								dottedName={dottedName}
								rules={parsedRules}
								value={rule.nodeValue}
								onChange={x => dispatch(updateSituation(dottedName, x))}
								useSwitch
							/>
						) : (
							<span className="">
								{rule.nodeValue ? `${formatValue(rule)}` : '-'}
							</span>
						)}
					</div>
				</div>
			</Animate.appear>
		</li>
	)
}

type WarningProps = {
	dottedName: DottedName
}

export function Warning({ dottedName }: WarningProps) {
	const warning = useEvaluation(dottedName)
	if (!warning.nodeValue) {
		return null
	}
	return <li>{warning.description}</li>
}
