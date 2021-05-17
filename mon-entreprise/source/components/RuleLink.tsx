import { DottedName } from 'modele-social'
import React, { useContext } from 'react'
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
	return null
}
