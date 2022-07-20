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

	try {
		engine.getRule(props.dottedName)
	} catch (error) {
		// eslint-disable-next-line no-console
		console.error(error)

		return null
	}

	return (
		<EngineRuleLink
			{...props}
			linkComponent={Link as React.ComponentType<{ to: string }>}
			engine={engine}
			documentationPath={sitePaths.documentation.index}
		/>
	)
}
