import { ThemeColorsProvider } from 'Components/utils/colors'
import { IsEmbeddedContext } from 'Components/utils/embeddedContext'
import Meta from 'Components/utils/Meta'
import useSimulationConfig from 'Components/utils/useSimulationConfig'
import { default as React, useContext, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { SimulatorData } from './metadata'

export default function SimulateurPage({
	meta,
	title,
	config,
	tooltip,
	component: Component,
	seoExplanations,
}: SimulatorData[keyof SimulatorData]) {
	const inIframe = useContext(IsEmbeddedContext)
	const fromGérer = !!useLocation<{ fromGérer?: boolean }>().state?.fromGérer
	useSimulationConfig(config, { useExistingCompanyFromSituation: fromGérer })

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

			<ThemeColorsProvider color={inIframe ? undefined : meta?.color}>
				<Component />
				{seoExplanations && !inIframe && seoExplanations}
			</ThemeColorsProvider>
		</>
	)
}
