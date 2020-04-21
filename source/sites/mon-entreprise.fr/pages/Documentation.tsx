import Documentation from 'Components/Documentation'
import { EngineContext } from 'Components/utils/EngineContext'
import { SitePathsContext } from 'Components/utils/SitePathsContext'
import React, { useContext } from 'react'
import { useLocation } from 'react-router'

export default function SiteDocumentation() {
	const engine = useContext(EngineContext)
	const sitePaths = useContext(SitePathsContext)
	const useDefaultValues =
		(useLocation().state as { useDefaultValues?: boolean })?.useDefaultValues ??
		false
	return (
		<Documentation
			engine={engine}
			basePath={sitePaths.documentation.index}
			useDefaultValues={useDefaultValues}
		/>
	)
}
