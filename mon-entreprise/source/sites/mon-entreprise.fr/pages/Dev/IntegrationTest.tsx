import React, { Suspense, useMemo } from 'react'
import useSimulatorsData from '../Simulateurs/metadata'
const LazyColorPicker = React.lazy(() => import('./ColorPicker'))

export default function IntegrationTest() {
	const simulators = useSimulatorsData()
	const integrableModuleNames = useMemo(
		() =>
			Object.values(simulators)
				.map(s => s.iframe)
				.filter(Boolean),
		[simulators]
	)
	const [currentModule, setCurrentModule] = React.useState(
		integrableModuleNames[0]
	)
	const [color, setColor] = React.useState('#005aa1')
	const [version, setVersion] = React.useState(0)
	const domNode = React.useRef<HTMLDivElement>(null)
	React.useEffect(() => {
		const script = document.createElement('script')
		script.id = 'script-monentreprise'
		script.src = window.location.origin + '/simulateur-iframe-integration.js'
		script.dataset.module = currentModule
		script.dataset.couleur = color
		if (domNode.current) {
			domNode.current.innerHTML = ''
			domNode.current.appendChild(script)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [version])
	return (
		<>
			<h2>Quel module ?</h2>
			<select onChange={event => setCurrentModule(event.target.value)}>
				{integrableModuleNames.map(name => (
					<option key={name}>{name}</option>
				))}
			</select>

			<h2>Quelle couleur ?</h2>
			<Suspense fallback={<div>Chargement...</div>}>
				<LazyColorPicker color={color} onChange={setColor} />
			</Suspense>

			<button
				className="ui__ button plain"
				onClick={() => setVersion(version + 1)}
			>
				{!version ? 'Visualiser le module' : 'Valider les changements'}
			</button>

			<div
				style={{ border: '2px dashed blue' }}
				css={`
					display: ${version > 0 ? 'block' : 'none'};
				`}
			>
				<div ref={domNode} />
			</div>
		</>
	)
}
