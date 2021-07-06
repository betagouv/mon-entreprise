import Engine from 'publicodes'
import { Documentation, getDocumentationSiteMap } from 'publicodes-react'
import { invertObj, last } from 'ramda'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import emoji from 'react-easy-emoji'
import MonacoEditor from 'react-monaco-editor'
import { useHistory, useLocation } from 'react-router-dom'
import styled from 'styled-components'

const EXAMPLE_CODE = `
# Bienvenue dans le bac à sable du langage publicodes !
# Pour en savoir plus sur le langage :
# => https://publi.codes/documentation/principes-de-base

prix:
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

export default function Studio() {
	const { search, pathname } = useLocation()
	const initialValue = useMemo(() => {
		const code = new URLSearchParams(search ?? '').get('code')
		return code ? code : EXAMPLE_CODE
	}, [search])
	const [editorValue, setEditorValue] = useState(initialValue)
	const debouncedEditorValue = useDebounce(editorValue, 1000)

	const history = useHistory()
	useEffect(() => {
		history.replace({
			pathname,
			search: `?code=${encodeURIComponent(debouncedEditorValue)}`,
		})
	}, [debouncedEditorValue, history])

	const handleShare = useCallback(() => {
		navigator.clipboard.writeText(window.location.href)
	}, [window.location.href])

	return (
		<Layout className="ui__ full-width">
			<MonacoEditor
				language="yaml"
				height="90vh"
				defaultValue={editorValue}
				onChange={(newValue) => setEditorValue(newValue ?? '')}
				options={{
					minimap: { enabled: false },
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

					<Results rules={debouncedEditorValue} onClickShare={handleShare} />
				</ErrorBoundary>
			</section>
		</Layout>
	)
}

type ResultsProps = {
	rules: string
	onClickShare: React.MouseEventHandler
}

class Logger {
	messages: string[] = []
	warn(message: string) {
		this.messages.push(message)
	}
	error(message: string) {
		this.messages.push(message)
	}
	log(message: string) {
		this.messages.push(message)
	}
	toJSX() {
		return this.messages.map((m) => (
			<div
				css={`
					background: lightyellow;
					padding: 20px;
					border-radius: 5px;
				`}
				key={m}
			>
				{nl2br(m)}
			</div>
		))
	}
}

export const Results = ({ onClickShare, rules }: ResultsProps) => {
	const logger = useMemo(() => new Logger(), [rules])
	const engine = useMemo(() => new Engine(rules, { logger }), [rules, logger])
	const targets = useMemo(() => Object.keys(engine.getParsedRules()), [engine])
	const documentationPath = '/studio'
	const pathToRules = useMemo(
		() => getDocumentationSiteMap({ engine, documentationPath }),
		[engine, documentationPath]
	)
	const ruleToPaths = useMemo(() => invertObj(pathToRules), [pathToRules])
	const { search, pathname } = useLocation()
	const history = useHistory()
	const setCurrentTarget = useCallback(
		(target) =>
			history.replace({
				pathname: ruleToPaths[target],
				search,
			}),
		[ruleToPaths, history, search]
	)
	useEffect(() => {
		if (!pathToRules[pathname]) {
			setCurrentTarget(last(targets))
		}
	})

	return (
		<>
			{logger.toJSX()}
			<div
				css={`
					display: flex;
					justify-content: space-between;
					align-items: baseline;
				`}
			>
				<small>
					Aller à{' '}
					<select
						onChange={(e) => {
							setCurrentTarget(e.target.value)
						}}
						css={`
							font-size: inherit;
							color: inherit;
							font-family: inherit;
						`}
					>
						{targets.map((target) => (
							<option
								key={target}
								value={target}
								selected={pathToRules[pathname] === target}
							>
								{target}
							</option>
						))}
					</select>
				</small>
				<div className="ui__ answer-group">
					<button className="ui__ simple small button" onClick={onClickShare}>
						{emoji('🔗')} Copier le lien
					</button>
				</div>
			</div>

			<ErrorBoundary>
				<Documentation
					engine={engine}
					documentationPath={documentationPath}
					language="fr"
				/>
			</ErrorBoundary>
		</>
	)
}

const newlineRegex = /(\r\n|\r|\n)/g

function nl2br(str: string) {
	if (typeof str !== 'string') {
		return str
	}

	return str.split(newlineRegex).map(function (line, index) {
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
	state: { error: false | { message: string; name: string } } = { error: false }

	static getDerivedStateFromError(error: Error) {
		console.error(error)
		return { error: { message: error.message, name: error.name } }
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
					<strong>{this.state.error.name}</strong>
					<br />
					{nl2br(this.state.error.message)}
					<br />
					<br />
					<a onClick={() => window.location.reload()}>Rafraichir</a>
				</div>
			)
		}
		return this.props.children
	}
}

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
