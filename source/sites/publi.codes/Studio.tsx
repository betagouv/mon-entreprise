import baremeIr from '!!raw-loader!./exemples/bareme-ir.yaml'
import douche from '!!raw-loader!./exemples/douche.yaml'
import { ControlledEditor } from '@monaco-editor/react'
import Engine from 'Engine/react'
import { safeLoad } from 'js-yaml'
import React, { useState } from 'react'
import emoji from 'react-easy-emoji'
import { useLocation } from 'react-router'
import styled from 'styled-components'
import { Header } from './Header'

let examples = {
	'bareme-ir': baremeIr,
	douche
}

let initialInput = `a:
  formule: 10€
b:
  formule: a + 18€
c:
  formule:
    multiplication: 
      assiette: 2000€
      taux: 3%
d:
  formule: a + b + c
`

export default function SafeStudio() {
	return (
		<div
			css={`
				display: flex;
				height: 100%;
				flex-direction: column;
			`}
		>
			<div className="ui__ container">
				<Header noSubtitle sectionName="Studio" />
			</div>
			<div
				css={`
					flex-grow: 1;
				`}
			>
				<ErrorBoundary>
					<Studio />
				</ErrorBoundary>
			</div>
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
	const [rules, setRules] = useState(editorValue)

	try {
		setTargets(Object.keys(safeLoad(editorValue) ?? {}))
	} catch {}

	return (
		<Engine.Provider rules={rules}>
			<Layout>
				<section>
					<ControlledEditor
						css={`
							height: 100%;
						`}
						language="yaml"
						value={editorValue}
						onChange={(ev, newValue) => setEditorValue(newValue ?? '')}
						options={{ minimap: { enabled: false } }}
					/>
				</section>
				<section
					css={`
						padding: 30px 20px;
					`}
				>
					<div
						css={`
							background: var(--lighterColor);
							padding: 20px;
							border-radius: 5px;
						`}
					>
						<label htmlFor="objectif">Que voulez-vous calculer ? </label>
						<select
							id="objectif"
							onChange={e => {
								setCurrentTarget(e.target.value)
							}}
							css={`
								padding: 5px;
							`}
						>
							{targets.map(target => (
								<option key={target} value={target}>
									{target}
								</option>
							))}
						</select>
						<br />
						<br />
						<button
							className="ui__ button small"
							onClick={() => setRules(editorValue)}
						>
							{emoji('▶️')} Recalculer
						</button>
					</div>
					<Results
						rule={targets.includes(currentTarget) ? currentTarget : targets[0]}
					/>
				</section>
			</Layout>
		</Engine.Provider>
	)
}

const Layout = styled.div`
	display: flex;
	height: 100%;

	section {
		width: 50%;
	}

	@media (max-width: 960px) {
		flex-direction: column;
		padding: 20px;

		section {
			width: 100%;
		}
	}
`

export const Results = ({ rule }) => {
	const analysis = Engine.useEvaluation(rule)
	return analysis ? (
		<div>
			<h2>Résultats</h2>
			{analysis.isApplicable === false ? (
				<>{emoji('❌')} Cette règle n'est pas applicable</>
			) : (
				<Engine.Evaluation expression={rule} />
			)}
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
