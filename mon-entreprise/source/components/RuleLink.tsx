import { RuleLink as EngineRuleLink } from 'publicodes-react'
import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { DottedName } from 'modele-social'
import { EngineContext } from './utils/EngineContext'
import { SitePathsContext } from './utils/SitePathsContext'

export default function RuleLink(
	props: {
		dottedName: DottedName
		displayIcon?: boolean
	} & Omit<React.ComponentProps<Link>, 'to'>
) {
	const sitePaths = useContext(SitePathsContext)
	const engine = useContext(EngineContext)
	return (
		<EngineRuleLink
			{...props}
			linkComponent={Link}
			engine={engine}
			documentationPath={sitePaths.documentation.index}
		/>
	)
}
