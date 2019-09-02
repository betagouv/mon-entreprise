import React, { Suspense } from 'react'
let LazyColorPicker = React.lazy(() => import('./ColorPicker'))

const integrableModuleNames = [
	'simulateur-embauche',
	'simulateur-autoentrepreneur',
	'simulateur-independant',
	'simulateur-assimilesalarie'
]

export default function IntegrationTest() {
	const [currentModule, setCurrentModule] = React.useState(
		integrableModuleNames[0]
	)
	const [colour, setColour] = React.useState('#005aa1')
	const [version, setVersion] = React.useState(0)
	const domNode = React.useRef(null)
	React.useEffect(() => {
		const script = document.createElement('script')
		script.id = 'script-monentreprise'
		script.src = window.location.origin + '/simulateur-iframe-integration.js'
		script.dataset.module = currentModule
		script.dataset.couleur = colour
		domNode.current.innerHTML = ''
		domNode.current.appendChild(script)
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
				<LazyColorPicker colour={colour} onChange={setColour} />
			</Suspense>

			<button
				className="ui__ button plain"
				onClick={() => setVersion(version + 1)}>
				{!version ? 'Visualiser le module' : 'Valider les changements'}
			</button>

			<div
				css={`
					display: ${version > 0 ? 'block' : 'none'};
				`}>
				<p>Code d'intégration </p>
				<IntegrationCode colour={colour} module={currentModule} />
				<div style={{ border: '2px dashed blue' }}>
					<div ref={domNode} />
				</div>
			</div>
		</>
	)
}

export let IntegrationCode = ({
	module = 'simulateur-embauche',
	colour = '#2975D1'
}) => (
	<code
		css={`
			display: block;
			font-size: 80%;
			width: 90%;
			padding: 1em;
			background: #f8f8f8;
			margin: auto;
			margin-bottom: 1em;
			overflow: auto;
			box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05),
				-1px 1px 1px rgba(0, 0, 0, 0.02);

			em {
				font-weight: 300;
				color: black;
			}

			:before {
				content: '';
				position: absolute;
				top: 0;
				right: 0;
				border-width: 0 16px 16px 0;
				border-style: solid;
				border-color: #e8e8e8 white;
			}
			#scriptColor {
				color: #2975d1;
			}
		`}>
		<span>{'<'}</span>
		<em>
			script
			<br />
			id
		</em>
		="script-simulateur-embauche"
		<em>data-module</em>="
		<span>{module}</span>"<em>data-couleur</em>="
		<span id="scriptColor">{colour}</span>" <em>src</em>
		="https://mon-entreprise.fr/simulateur-iframe-integration.js">
		<span>{'<'}</span>
		<span>/</span>
		<em>script</em>
		<span>></span>
	</code>
)
