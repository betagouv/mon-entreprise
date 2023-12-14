import { RuleLink as EngineRuleLink } from '@publicodes/react-ui'
import { DottedName } from 'modele-social'
import Engine from 'publicodes'
import React, { ReactNode, useContext } from 'react'

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
		linkComponent?: ReactNode
		engine?: Engine<DottedName>
	} & Omit<React.ComponentProps<typeof Link>, 'to' | 'children'>
) {
	const { absoluteSitePaths } = useSitePaths()
	const defaultEngine = useContext(EngineContext)

	const engineUsed = props?.engine ?? defaultEngine

	try {
		engineUsed.getRule(props.dottedName)
	} catch (error) {
		// eslint-disable-next-line no-console
		console.error(error)

		return null
	}

	return (
		<EngineRuleLink
			{...props}
			// @ts-ignore
			linkComponent={props?.linkComponent || Link}
			engine={engineUsed}
			documentationPath={
				props.documentationPath ?? absoluteSitePaths.documentation.index
			}
		/>
	)
}
