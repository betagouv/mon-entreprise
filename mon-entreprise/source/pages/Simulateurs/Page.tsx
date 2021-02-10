import { ThemeColorsProvider } from 'Components/utils/colors'
import { IsEmbeddedContext } from 'Components/utils/embeddedContext'
import Meta from 'Components/utils/Meta'
import useSimulationConfig from 'Components/utils/useSimulationConfig'
import PreviousSimulationBanner from 'Components/PreviousSimulationBanner'
import { default as React, useContext, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { SimulatorData } from './metadata'
import useSearchParamsSimulationSharing from 'Components/utils/useSearchParamsSimulationSharing'

export default function SimulateurPage({
	meta,
	title,
	config,
	tooltip,
	description,
	component: Component,
	seoExplanations,
}: SimulatorData[keyof SimulatorData]) {
	const inIframe = useContext(IsEmbeddedContext)
	const fromGérer = !!useLocation<{ fromGérer?: boolean }>().state?.fromGérer
	useSimulationConfig(config, { useExistingCompanyFromSituation: fromGérer })
	useSearchParamsSimulationSharing()

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
			{description && !inIframe && description}

			<ThemeColorsProvider color={inIframe ? undefined : meta?.color}>
				<Component />
				{config && <PreviousSimulationBanner />}
				{seoExplanations && !inIframe && seoExplanations}
			</ThemeColorsProvider>
		</>
	)
}
