import ColorPicker from '@atomik-color/component'
import { str2Color } from '@atomik-color/core'
import { useEffect, useMemo, useRef, useState } from 'react'

import { Button, H2 } from '@/design-system'
import useSimulatorsData from '@/hooks/useSimulatorsData'

export default function IntegrationTest() {
	const simulators = useSimulatorsData()
	const integrableModuleNames = useMemo(
		() =>
			Object.values(simulators)
				.map((s) =>
					'iframePath' in s
						? {
								iframePath: s.iframePath,
								private: 'private' in s ? s.private : false,
						  }
						: false
				)
				.filter(((el) => Boolean(el)) as <T>(x: T | false) => x is T),
		[simulators]
	)
	const [currentModule, setCurrentModule] = useState<string>(
		integrableModuleNames[0]?.iframePath
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
				{integrableModuleNames.map((el) => (
					<option key={el.iframePath} value={el.iframePath}>
						{el.iframePath}
						{el.private ? ' [private]' : ''}
					</option>
				))}
			</select>

			<H2>Quelle couleur ?</H2>
			<ColorPicker
				value={str2Color(color)}
				onChange={({ hex }: { hex: string }) => setColor(`#${hex}`)}
			/>

			<Button onPress={() => setVersion(version + 1)}>
				{!version ? 'Visualiser le module' : 'Valider les changements'}
			</Button>

			<div
				style={{
					border: '2px dashed blue',
					display: version > 0 ? 'block' : 'none',
				}}
			>
				<div ref={domNode} />
			</div>
		</>
	)
}
