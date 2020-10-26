import { setSimulationConfig } from 'Actions/actions'
import { IsEmbeddedContext } from 'Components/utils/embeddedContext'
import Meta from 'Components/utils/Meta'
import { default as React, useContext, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { SimulatorData } from './metadata'

export default function SimulateurPage({
	meta,
	title,
	config,
	tooltip,
	component: Component,
	seoExplanations
}: SimulatorData[keyof SimulatorData]) {
	const inIframe = useContext(IsEmbeddedContext)
	const dispatch = useDispatch()
	const fromGérer = !!useLocation<{ fromGérer?: boolean }>().state?.fromGérer
	useEffect(() => {
		if (!config) {
			return
		}
		dispatch(setSimulationConfig(config, fromGérer))
	}, [config])

	return (
		<>
			{meta && <Meta {...meta} />}
			{title && !inIframe && (
				<>
					<h1>{title}</h1>
					{tooltip && (
						<h2
							css={`
								margin-top: 0;
							`}
						>
							<small>{tooltip}</small>
						</h2>
					)}
				</>
			)}
			<Component />
			{seoExplanations && !inIframe && seoExplanations}
		</>
	)
}
