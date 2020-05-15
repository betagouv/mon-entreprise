import { RuleLink as EngineRuleLink } from 'publicodes'
import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { DottedName } from 'Rules'
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
			engine={engine}
			documentationPath={sitePaths.documentation.index}
		/>
	)
}
