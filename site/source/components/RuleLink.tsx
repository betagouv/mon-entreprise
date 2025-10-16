import { RuleLink as EngineRuleLink } from '@publicodes/react-ui'
import Engine from 'publicodes'
import React, { ReactNode } from 'react'

import { Link } from '@/design-system'
import { DottedName } from '@/domaine/publicodes/DottedName'
import { useSitePaths } from '@/sitePaths'

import { useEngine } from './utils/EngineContext'

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
	const defaultEngine = useEngine()

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
