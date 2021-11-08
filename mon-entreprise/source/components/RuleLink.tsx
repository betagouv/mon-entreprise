import { Link } from 'DesignSystem/typography/link'
import { DottedName } from 'modele-social'
import { RuleLink as EngineRuleLink } from 'publicodes-react'
import React, { useContext } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { EngineContext } from './utils/EngineContext'
import { SitePathsContext } from './utils/SitePathsContext'

export default function RuleLink(
	props: {
		dottedName: DottedName
		displayIcon?: boolean
	} & Omit<React.ComponentProps<RouterLink>, 'to'>
) {
	const sitePaths = useContext(SitePathsContext)
	const engine = useContext(EngineContext)
	return (
		<EngineRuleLink
			{...props}
			linkComponent={Link as typeof RouterLink}
			engine={engine}
			documentationPath={sitePaths.documentation.index}
		/>
	)
}
