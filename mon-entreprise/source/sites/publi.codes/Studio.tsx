// import { ControlledEditor } from '@monaco-editor/react'
import Engine from 'publicodes'
import { formatValue } from 'publicodes'
import yaml from 'yaml'
import { last } from 'ramda'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import emoji from 'react-easy-emoji'
import MonacoEditor from 'react-monaco-editor'
import { useLocation } from 'react-router-dom'
import styled from 'styled-components'

const EXAMPLE_CODE = `
# Bienvenue dans le bac à sable du langage publicode ! 
# Pour en savoir plus sur le langage, consultez le tutoriel :
# => https://publi.codes

prix . carottes: 2€/kg
prix . champignons: 5€/kg
prix . avocat: 2€/avocat

dépenses primeur:
  formule: 
    somme:
      - prix . carottes * 1.5 kg
      - prix . champignons * 500g
      - prix . avocat * 3 avocat
`

function useDebounce<T>(value: T, delay: number) {
	const [debouncedValue, setDebouncedValue] = useState(value)
	useEffect(
		() => {
			// Update debounced value after delay
			const handler = setTimeout(() => {
				setDebouncedValue(value)
			}, delay)

			// Cancel the timeout if value changes (also on delay change or unmount)
			// This is how we prevent debounced value from updating if value is changed ...
			// .. within the delay period. Timeout gets cleared and restarted.
			return () => {
				clearTimeout(handler)
			}
		},
		[value, delay] // Only re-call effect if value or delay changes
	)
	return debouncedValue
}
export default function Studio() {
	const search = useLocation().search
	const initialValue = useMemo(() => {
		const code = new URLSearchParams(search ?? '').get('code')
		return code ? code : EXAMPLE_CODE
	}, [search])
	const [editorValue, setEditorValue] = useState(initialValue)
	const debouncedEditorValue = useDebounce(editorValue, 1000)

	const targets = useMemo(() => {
		try {
			return Object.keys(yaml.parse(debouncedEditorValue) ?? {})
		} catch (e) {
			console.error(e)
			return []
		}
	}, [debouncedEditorValue])

	useEffect(() => {
		history.replaceState(
			null,
			'',
			`${window.location.pathname}?code=${encodeURIComponent(
				debouncedEditorValue
			)}`
		)
	}, [debouncedEditorValue])

	const handleShare = useCallback(() => {
		navigator.clipboard.writeText(window.location.href)
	}, [window.location.href])

	return (
		<Layout>
			<MonacoEditor
				language="yaml"
				height="90vh"
				defaultValue={editorValue}
				onChange={newValue => setEditorValue(newValue ?? '')}
				options={{
					minimap: { enabled: false }
				}}
			/>
			<section
				css={`
					padding: 0 1rem;
					flex: 1;
				`}
			>
				<ErrorBoundary key={debouncedEditorValue}>
					{/* TODO: prévoir de changer la signature de EngineProvider */}

					<Results
						targets={targets}
						rules={debouncedEditorValue}
						onClickShare={handleShare}
					/>
				</ErrorBoundary>
			</section>
		</Layout>
	)
}

type ResultsProps = {
	targets: string[]
	rules: string
	onClickShare: React.MouseEventHandler
}

export const Results = ({ targets, onClickShare, rules }: ResultsProps) => {
	const [rule, setCurrentTarget] = useState<string>()
	const currentTarget = rule ?? (last(targets) as string)
	const engine = useMemo(() => new Engine(rules), [rules])
	// EN ATTENDANT d'AVOIR une meilleure gestion d'erreur, on va mocker
	// console.warn
	const warnings: string[] = []
	const originalWarn = console.warn
	console.warn = (warning: string) => warnings.push(warning)
	const evaluation = engine.evaluate(currentTarget)
	console.warn = originalWarn

	return (
		<>
			<div
				css={`
					background: var(--lighterColor);
					padding: 20px;
					border-radius: 5px;
				`}
			>
				<p className="ui__ notice">
					<label htmlFor="objectif">Que voulez-vous calculer ? </label>
				</p>
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
						<option
							key={target}
							value={target}
							selected={currentTarget === target}
						>
							{target}
						</option>
					))}
				</select>
				<br />
				<br />
				<div className="ui__ answer-group">
					<button className="ui__ button small" onClick={onClickShare}>
						{emoji('🔗')} Copier le lien
					</button>
				</div>
			</div>
			{warnings.map(warning => (
				<div
					css={`
						background: lightyellow;
						padding: 20px;
						border-radius: 5px;
					`}
					key={warning}
				>
					{nl2br(warning)}
				</div>
			))}
			{evaluation ? (
				<div>
					<h2>Résultats</h2>
					{evaluation.isApplicable === false ? (
						<>{emoji('❌')} Cette règle n'est pas applicable</>
					) : (
						<>
							<p>
								<strong>
									{formatValue({
										...evaluation,
										language: 'fr'
									})}
								</strong>
							</p>
							<br />
							{'temporalValue' in evaluation &&
								evaluation.temporalValue &&
								evaluation.temporalValue
									.filter(({ value }) => value !== false)
									.map(({ start: du, end: au, value }) => (
										<span key={`${du ?? ''}-${au ?? ''}`}>
											<small>
												Du <em>{du}</em> au <em>{au}</em> :{' '}
											</small>
											<code>
												{formatValue({
													nodeValue: value,
													unit: evaluation.unit,
													language: 'fr'
												})}
											</code>{' '}
											<br />
										</span>
									))}
						</>
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
	> :first-child {
		width: 55% !important;
	}

	@media (max-width: 960px) {
		flex-direction: column;
		padding: 20px;

		> :first-child {
			width: 100% !important;
		}
	}
`

class ErrorBoundary extends React.Component {
	state: { error: false | string } = { error: false }

	static getDerivedStateFromError(error) {
		console.error(error)
		return { error: error.message }
	}
	render() {
		if (this.state.error) {
			return (
				<div
					css={`
						background: lightyellow;
						padding: 20px;
						border-radius: 5px;
					`}
				>
					{nl2br(this.state.error)}
				</div>
			)
		}
		return this.props.children
	}
}
