import { useWorkerEngine } from '@publicodes/worker-react'
import { DottedName } from 'modele-social'
import { RuleLink as EngineRuleLink } from 'publicodes-react'
import React from 'react'

import { Link } from '@/design-system/typography/link'
import { usePromise } from '@/hooks/usePromise'
import { useSitePaths } from '@/sitePaths'

// TODO : quicklink -> en cas de variations ou de somme avec un seul élément actif, faire un lien vers cet élément
export default function RuleLink(
	props: {
		dottedName: DottedName
		children?: React.ReactNode
		documentationPath?: string
	} & Omit<React.ComponentProps<typeof Link>, 'to' | 'children'>
) {
	const { dottedName, documentationPath, ...linkProps } = props
	const { absoluteSitePaths } = useSitePaths()
	const [loading, setLoading] = React.useState(true)
	const [error, setError] = React.useState(false)
	const workerEngine = useWorkerEngine()

	usePromise(() => {
		setLoading(true)
		setError(false)

		return workerEngine
			.asyncGetRule(dottedName)
			.catch(() => setError(true))
			.then(() => setLoading(false))
	}, [dottedName, workerEngine])

	if (loading || error) {
		return null
	}

	return (
		<EngineRuleLink
			{...linkProps}
			// @ts-ignore
			linkComponent={Link}
			engine={workerEngine}
			documentationPath={
				documentationPath ?? absoluteSitePaths.documentation.index
			}
		/>
	)
}
