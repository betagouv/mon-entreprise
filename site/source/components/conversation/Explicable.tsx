import { DottedName } from 'modele-social'

import { References } from '@/components/References'
import RuleLink from '@/components/RuleLink'
import { useEngine } from '@/components/utils/EngineContext'
import { H3, HelpButtonWithPopover, Markdown, Spacing } from '@/design-system'
import { useReferences } from '@/pages/assistants/choix-du-statut/résultat'

export function ExplicableRule<Names extends string = DottedName>({
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
	const engine = useEngine()
	const rule = engine.getRule(dottedName as DottedName)
	const références = useReferences(rule)

	if (rule.rawNode.description == null) {
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
			aria-label={`Plus d'informations sur ${rule.title}`}
			{...props}
		>
			<Markdown>{rule.rawNode.description}</Markdown>

			<RuleLink dottedName={dottedName as DottedName}>
				Lire la documentation
			</RuleLink>

			{références && (
				<>
					<H3>Liens utiles</H3>
					<References references={références} />
				</>
			)}
			<Spacing xxl />
		</HelpButtonWithPopover>
	)
}
