import baremeIr from '!!raw-loader!./exemples/bareme-ir.yaml'
import douche from '!!raw-loader!./exemples/douche.yaml'
import { ControlledEditor } from '@monaco-editor/react'
import Engine from 'Engine/react'
import { safeLoad } from 'js-yaml'
import React, { useEffect, useState } from 'react'
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
    produit: 
      assiette: 2000€
      taux: 3%
d:
  formule: a + b + c
`

export default function Studio() {
	const { search } = useLocation()
	const currentExample = new URLSearchParams(search ?? '').get('exemple')
	const [editorValue, setEditorValue] = useState(
		currentExample && Object.keys(examples).includes(currentExample)
			? examples[currentExample]
			: initialInput
	)
	const [targets, setTargets] = useState<string[]>([])
	const [rules, setRules] = useState(editorValue)

	useEffect(() => {
		try {
			setTargets(Object.keys(safeLoad(editorValue) ?? {}))
		} catch {}
	}, [editorValue])

	return (
		<Engine.Provider rules={rules}>
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
				<Layout>
					<section>
						<ControlledEditor
							css={`
								height: 100%;
							`}
							language="yaml"
							value={editorValue}
							onChange={(_ev, newValue) => setEditorValue(newValue ?? '')}
							options={{ minimap: { enabled: false } }}
						/>
					</section>
					<section
						css={`
							padding: 30px 20px;
						`}
					>
						<Results
							targets={targets}
							onClickUpdate={() => setRules(editorValue)}
						/>
					</section>
				</Layout>
			</div>
		</Engine.Provider>
	)
}

export const Results = ({ targets, onClickUpdate }) => {
	const [currentTarget, setCurrentTarget] = useState('')
	const rule = targets.includes(currentTarget) ? currentTarget : targets[0]
	const error = Engine.useError()
	const analysis = Engine.useEvaluation(rule)
	return error !== null ? (
		<div
			css={`
				background: lightyellow;
				padding: 20px;
				border-radius: 5px;
			`}
		>
			{nl2br(error)}
			<br />
			<br />
			<button className="ui__ button small" onClick={onClickUpdate}>
				{emoji('▶️')} Ré-essayer
			</button>
		</div>
	) : (
		<>
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
				<button className="ui__ button small" onClick={onClickUpdate}>
					{emoji('▶️')} Recalculer
				</button>
			</div>
			{analysis ? (
				<div>
					<h2>Résultats</h2>
					{analysis.isApplicable === false ? (
						<>{emoji('❌')} Cette règle n'est pas applicable</>
					) : (
						<Engine.Evaluation expression={rule} />
					)}
				</div>
			) : null}
		</>
	)
}

const newlineRegex = /(\r\n|\r|\n)/g

function nl2br(str: string) {
	if (typeof str !== 'string') {
		return str
	}

	return str.split(newlineRegex).map(function(line, index) {
		if (line.match(newlineRegex)) {
			return React.createElement('br', { key: index })
		}
		return line
	})
}

const Layout = styled.div`
	flex-grow: 1;
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
