import { DottedName } from 'modele-social'
import { RuleLink as EngineRuleLink } from 'publicodes-react'
import React, { useContext } from 'react'

import { Link } from '@/design-system/typography/link'
import { useSitePaths } from '@/sitePaths'

import { EngineContext } from './utils/EngineContext'

// TODO : quicklink -> en cas de variations ou de somme avec un seul élément actif, faire un lien vers cet élément
export default function RuleLink(
	props: {
		dottedName: DottedName
		displayIcon?: boolean
		children?: React.ReactNode
		documentationPath?: string
	} & Omit<React.ComponentProps<typeof Link>, 'to' | 'children'>
) {
	const { absoluteSitePaths } = useSitePaths()
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
			documentationPath={
				props.documentationPath ?? absoluteSitePaths.documentation.index
			}
		/>
	)
}
