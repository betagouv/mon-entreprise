import baremeIr from '!!raw-loader!./exemples/bareme-ir.yaml'
import douche from '!!raw-loader!./exemples/douche.yaml'
import { ControlledEditor } from '@monaco-editor/react'
import Engine from 'Engine/index'
import { buildFlatRules } from 'Engine/rules'
import { serializeUnit } from 'Engine/units'
import { safeLoad } from 'js-yaml'
import React, { useRef, useState } from 'react'
import emoji from 'react-easy-emoji'
import { useLocation } from 'react-router'
import { Header } from './Header'

let examples = {
	'bareme-ir': baremeIr,
	douche
}

let initialInput = `a:
  formule: 10
b:
  formule: a + 18
c:
  formule:
    multiplication: 
      assiette: 2000
      taux: 3%
d:
  formule: a + b + c
`

export default function SafeStudio() {
	return (
		<div className="app-content ui__ container" css="margin-bottom: 2rem">
			<Header noSubtitle sectionName="Studio" />
			<ErrorBoundary>
				<Studio />
			</ErrorBoundary>
		</div>
	)
}
export function Studio() {
	const { search } = useLocation()
	const currentExample = new URLSearchParams(search ?? '').get('exemple')
	const [editorValue, setEditorValue] = useState(
		currentExample && Object.keys(examples).includes(currentExample)
			? examples[currentExample]
			: initialInput
	)
	const [targets, setTargets] = useState<string[]>([])
	const [currentTarget, setCurrentTarget] = useState('')
	const [analysis, setAnalysis] = useState()
	const engine = useRef<any>(null)

	try {
		setTargets(Object.keys(safeLoad(editorValue) ?? {}))
	} catch {}

	function updateResult() {
		engine.current = new Engine.Engine(buildFlatRules(safeLoad(editorValue)))
		engine.current.evaluate(
			[targets.includes(currentTarget) ? currentTarget : targets[0]],
			{ defaultUnits: [], situation: {} }
		)
		setAnalysis(engine.current.getLastEvaluationExplanations()?.targets?.[0])
	}

	return (
		<div>
			Construisez votre modèle ici :
			<ControlledEditor
				height="40vh"
				language="yaml"
				value={editorValue}
				onChange={(ev, newValue) => setEditorValue(newValue ?? '')}
				options={{ minimap: { enabled: false } }}
			/>
			<div>
				<label htmlFor="objectif">Que voulez-vous calculer ? </label>
				<select
					onChange={e => {
						setCurrentTarget(e.target.value)
					}}
				>
					{targets.map(target => (
						<option key={target} value={target}>
							{target}
						</option>
					))}
				</select>
			</div>
			<button
				css="display: block; margin-top: 1rem"
				className="ui__ button small"
				onClick={() => updateResult()}
			>
				{emoji('▶️')} Mettre à jour
			</button>
			<Results analysis={analysis} />
		</div>
	)
}
export const Results = ({ analysis }) => {
	return analysis ? (
		<div>
			<h2>Résultats</h2>
			<ul>
				<li>Valeur : {analysis.nodeValue}</li>
				<li>
					Unité : {analysis.unit ? serializeUnit(analysis.unit) : 'Sans unité'}
				</li>
				<li>Applicable : {analysis.isApplicable ? '✅' : '❌'}</li>
			</ul>
		</div>
	) : null
}

class ErrorBoundary extends React.Component {
	state = {
		error: false as false | { message: string }
	}
	static getDerivedStateFromError(error) {
		// Mettez à jour l'état, de façon à montrer l'UI de repli au prochain rendu.
		return { error }
	}

	render() {
		return (
			<>
				{this.state.error ? (
					<p css="max-height: 4rem; overflow: hidden; border: 3px solid red;">
						Erreur :{' '}
						{
							this.state.error.message.split(
								'The error may be correlated with'
							)[0]
						}
					</p>
				) : (
					this.props.children
				)}
			</>
		)
	}
}
