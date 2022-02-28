import { Link } from '@/design-system/typography/link'
import { DottedName } from 'modele-social'
import { RuleLink as EngineRuleLink } from 'publicodes-react'
import React, { useContext } from 'react'
import { NavLink } from 'react-router-dom'
import { EngineContext } from './utils/EngineContext'
import { SitePathsContext } from './utils/SitePathsContext'

export default function RuleLink(
	props: {
		dottedName: DottedName
		displayIcon?: boolean
		children?: React.ReactNode
	} & Omit<React.ComponentProps<typeof Link>, 'to' | 'children'>
) {
	const sitePaths = useContext(SitePathsContext)
	const engine = useContext(EngineContext)
	return (
		<EngineRuleLink
			{...props}
			linkComponent={Link as typeof NavLink}
			engine={engine}
			documentationPath={sitePaths.documentation.index}
		/>
	)
}
