import { RuleLink as EngineRuleLink } from '@publicodes/react-ui'
import Engine from 'publicodes'
import { ReactNode } from 'react'
import { useSelector } from 'react-redux'

import { Link } from '@/design-system'
import { DottedName } from '@/domaine/publicodes/DottedName'
import { useDocumentationPath } from '@/hooks/useDocumentationIndexPath'
import { nomModèleSelector } from '@/store/selectors/simulation/config/nomModèle.selector'
import { useEngine } from '@/utils/publicodes/EngineContext'

type Props = {
	documentationPath?: string
	dottedName: DottedName
	engine?: Engine<DottedName>
	'aria-label'?: string
	id?: string
	children?: ReactNode
}

// TODO : quicklink -> en cas de variations ou de somme avec un seul élément actif, faire un lien vers cet élément
export default function RuleLink({
	dottedName,
	children,
	documentationPath,
	engine,
	'aria-label': ariaLabel,
	id,
}: Props) {
	const nomModèle = useSelector(nomModèleSelector)

	const documentationIndex = useDocumentationPath(nomModèle)
	const defaultEngine = useEngine()

	const engineUsed = engine ?? defaultEngine

	try {
		engineUsed.getRule(dottedName)
	} catch (error) {
		// eslint-disable-next-line no-console
		console.error(error)

		return null
	}

	return (
		<EngineRuleLink
			id={id}
			dottedName={dottedName}
			aria-label={ariaLabel}
			// @ts-ignore
			linkComponent={Link}
			engine={engineUsed}
			documentationPath={documentationPath ?? documentationIndex}
		>
			{children}
		</EngineRuleLink>
	)
}
