import HSL from "Components/utils/color/HSL"
import HSLInterface from "Components/utils/color/HSLInterface"
import { lazy, useState, useRef, useEffect, Suspense, useMemo } from 'react'
import useSimulatorsData from '../Simulateurs/metadata'
const LazyColorPicker = lazy(() => import('./ColorPicker'))

export default function IntegrationTest() {
	const simulators = useSimulatorsData()
	const integrableModuleNames = useMemo(
		() =>
			Object.values(simulators)
				.map((s) => s.iframePath)
				.filter(Boolean),
		[simulators]
	)
	const [currentModule, setCurrentModule] = useState(integrableModuleNames[0])
	const baseColor: HSLInterface = new HSL([206.46, 1, 0.31569]);
	const [color, setColor] = useState(baseColor)
	const [version, setVersion] = useState(0)
	const domNode = useRef<HTMLDivElement>(null)
	useEffect(() => {
		const script = document.createElement('script')
		script.id = 'script-monentreprise'
		script.src = window.location.origin + '/simulateur-iframe-integration.js'
		script.dataset.module = currentModule
		script.dataset.couleur = color.toString()
		if (domNode.current) {
			domNode.current.innerHTML = ''
			domNode.current.appendChild(script)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [version])
	return (
		<>
			<h2>Quel module ?</h2>
			<select onChange={(event) => setCurrentModule(event.target.value)}>
				{integrableModuleNames.map((name) => (
					<option key={name}>{name}</option>
				))}
			</select>

			<h2>Quelle couleur ?</h2>
			<Suspense fallback={<div>Chargement...</div>}>
				<LazyColorPicker color={color} onChange={ setColor } />
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
