import React, { Suspense } from 'react'
const LazyColorPicker = React.lazy(() => import('./ColorPicker'))

export const integrableModuleNames = [
	'simulateur-embauche',
	'simulateur-autoentrepreneur',
	'simulateur-independant',
	'simulateur-assimilesalarie',
	'simulateur-artiste-auteur',
	'simulateur-chomage-partiel'
]

export default function IntegrationTest() {
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
			<p>
				Les 4 simulateurs mon-entreprise.fr sont disponibles à l'intégration sur
				un site tiers. Ils sont hébergés chez nous, et il suffit de placer un
				simple bout de code Javascript dans votre code HTML.
			</p>
			<p>Choisissez d'abord le module et la couleur qui vous conviennent.</p>
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
