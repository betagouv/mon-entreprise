import { DottedName } from 'modele-social'
import { RuleLink as EngineRuleLink } from 'publicodes-react'
import React, { ReactNode } from 'react'

import { Link } from '@/design-system/typography/link'
import { usePromise } from '@/hooks/usePromise'
import { useSitePaths } from '@/sitePaths'
import { useWorkerEngine } from '@/worker/workerEngineClientReact'

// TODO : quicklink -> en cas de variations ou de somme avec un seul élément actif, faire un lien vers cet élément
export default function RuleLink(
	props: {
		dottedName: DottedName
		displayIcon?: boolean
		children?: React.ReactNode
		documentationPath?: string
		linkComponent?: ReactNode
		engineId?: number
	} & Omit<React.ComponentProps<typeof Link>, 'to' | 'children'>
) {
	const engineId = props.engineId ?? 0
	const { absoluteSitePaths } = useSitePaths()
	const [loading, setLoading] = React.useState(true)
	const [error, setError] = React.useState(false)
	const workerEngine = useWorkerEngine()

	usePromise(() => {
		setLoading(true)
		setError(false)

		return workerEngine
			.asyncGetRule(props.dottedName)
			.catch(() => setError(true))
			.then(() => setLoading(false))
	}, [props.dottedName, workerEngine])

	if (loading || error) {
		return null
	}

	return <>EngineRuleLink</>

	// TODO : publicodes-react ne supporte pas encore les engines dans un worker
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
