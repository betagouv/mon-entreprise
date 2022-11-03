import { useEffect, useMemo, useRef, useState } from 'react'
import { HexColorPicker } from 'react-colorful'

import { Button } from '@/design-system/buttons'
import { H2 } from '@/design-system/typography/heading'

import useSimulatorsData from '../Simulateurs/metadata'

export default function IntegrationTest() {
	const simulators = useSimulatorsData()
	const integrableModuleNames = useMemo(
		() =>
			Object.values(simulators)
				.map((s) => 'iframePath' in s && s.iframePath)
				.filter(((el) => Boolean(el)) as <T>(x: T | false) => x is T),
		[simulators]
	)
	const [currentModule, setCurrentModule] = useState<string>(
		integrableModuleNames[0]
	)
	const [color, setColor] = useState('#005aa1')
	const [version, setVersion] = useState(0)
	const domNode = useRef<HTMLDivElement>(null)
	useEffect(() => {
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
			<H2>Quel module ?</H2>
			<select onChange={(event) => setCurrentModule(event.target.value)}>
				{integrableModuleNames.map((name) => (
					<option key={name}>{name}</option>
				))}
			</select>

			<H2>Quelle couleur ?</H2>
			<HexColorPicker color={color} onChange={setColor} />

			<Button onPress={() => setVersion(version + 1)}>
				{!version ? 'Visualiser le module' : 'Valider les changements'}
			</Button>

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
