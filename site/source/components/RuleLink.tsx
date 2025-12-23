import { RuleLink as EngineRuleLink } from '@publicodes/react-ui'
import Engine from 'publicodes'
import { ReactNode } from 'react'
import { useSelector } from 'react-redux'

import { Link } from '@/design-system'
import { DottedName } from '@/domaine/publicodes/DottedName'
import { NomModèle } from '@/domaine/SimulationConfig'
import { useDocumentationPath } from '@/hooks/useDocumentationIndexPath'
import { useEngine } from '@/hooks/useEngine'
import { nomModèleSelector } from '@/store/selectors/simulation/config/nomModèle.selector'

type Props = {
	documentationPath?: string
	dottedName: DottedName
	engine?: Engine<DottedName>
	'aria-label'?: string
	id?: string
	children?: ReactNode
	nomModèle?: NomModèle
}

// TODO : quicklink -> en cas de variations ou de somme avec un seul élément actif, faire un lien vers cet élément
export default function RuleLink({
	dottedName,
	children,
	documentationPath,
	engine,
	'aria-label': ariaLabel,
	id,
	nomModèle,
}: Props) {
	const defaultNomModèle = useSelector(nomModèleSelector)
	const nomModèleUsed = nomModèle ?? defaultNomModèle

	const documentationIndex = useDocumentationPath(nomModèleUsed)
	const defaultEngine = useEngine(nomModèleUsed)

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
