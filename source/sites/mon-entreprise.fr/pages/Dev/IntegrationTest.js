import React from 'react'

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
	const domNode = React.useRef(null)
	React.useEffect(() => {
		const script = document.createElement('script')
		script.id = 'script-monentreprise'
		script.src = window.location.origin + '/simulateur-iframe-integration.js'
		script.dataset.module = currentModule
		script.dataset.couleur = '#005aa1'
		domNode.current.innerHTML = ''
		domNode.current.appendChild(script)
	}, [currentModule])
	return (
		<>
			<select onChange={event => setCurrentModule(event.target.value)}>
				{integrableModuleNames.map(name => (
					<option key={name}>{name}</option>
				))}
			</select>
			<div style={{ border: '2px solid blue' }}>
				<div ref={domNode} />
			</div>
		</>
	)
}
