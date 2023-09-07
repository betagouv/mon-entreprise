import { useWorkerEngine } from '@publicodes/worker-react'
import { DottedName } from 'modele-social'
import { useContext, useEffect } from 'react'

// import { EngineContext } from '@/components/utils/EngineContext'
import { Markdown } from '@/components/utils/markdown'
import HelpButtonWithPopover from '@/design-system/buttons/HelpButtonWithPopover'
import { Spacing } from '@/design-system/layout'
import { H3 } from '@/design-system/typography/heading'
import { usePromise } from '@/hooks/usePromise'

import { References } from '../References'
import RuleLink from '../RuleLink'

export function ExplicableRule<Names extends DottedName>({
	dottedName,
	light,
	bigPopover,
	title,
	...props
}: {
	dottedName: Names
	light?: boolean
	bigPopover?: boolean
	title?: string
}) {
	const workerEngine = useWorkerEngine()
	const rule = dottedName != null ? workerEngine.getRule(dottedName) : null

	// Rien à expliquer ici, ce n'est pas une règle
	if (dottedName == null) {
		return null
	}

	if (rule?.rawNode.description == null) {
		return null
	}

	// TODO montrer les variables de type 'une possibilité'

	return (
		<HelpButtonWithPopover
			key={rule.dottedName}
			type="info"
			title={title ?? rule.title}
			light={light}
			bigPopover={bigPopover}
			className="print-hidden"
			aria-haspopup="dialog"
			aria-label={`Plus d'info sur, ${rule.title}`}
			{...props}
		>
			<Markdown>{rule.rawNode.description}</Markdown>

			<RuleLink dottedName={dottedName}>Lire la documentation</RuleLink>

			{rule.rawNode.références && (
				<>
					<H3>Liens utiles</H3>
					<References references={rule.rawNode.références} />
				</>
			)}
			<Spacing xxl />
		</HelpButtonWithPopover>
	)
}
