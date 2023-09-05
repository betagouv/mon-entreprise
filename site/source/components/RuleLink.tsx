import { usePromise, useWorkerEngine } from '@publicodes/worker-react'
import { DottedName } from 'modele-social'
import { RuleLink as EngineRuleLink } from 'publicodes-react'
import React from 'react'

import { Link } from '@/design-system/typography/link'
import { useSitePaths } from '@/sitePaths'

// TODO : quicklink -> en cas de variations ou de somme avec un seul élément actif, faire un lien vers cet élément
export default function RuleLink(
	props: {
		dottedName: DottedName
		children?: React.ReactNode
		documentationPath?: string
	} & Omit<React.ComponentProps<typeof Link>, 'to' | 'children'>
) {
	const { dottedName, documentationPath, children, ...linkProps } = props
	const { absoluteSitePaths } = useSitePaths()
	const [loading, setLoading] = React.useState(true)
	const [error, setError] = React.useState(false)
	const workerEngine = useWorkerEngine()

	usePromise(async () => {
		setLoading(true)
		setError(false)

		try {
			const rule = await workerEngine.asyncGetRule(dottedName)
		} catch (error) {
			setError(true)
		}

		setLoading(false)
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
			dottedName={dottedName}
			documentationPath={
				documentationPath ?? absoluteSitePaths.documentation.index
			}
		>
			{children}
		</EngineRuleLink>
	)
}
