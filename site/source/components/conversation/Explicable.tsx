import { DottedName } from 'modele-social'
import { useTranslation } from 'react-i18next'

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
	ariaDescribedBy,
	...props
}: {
	dottedName: Names
	light?: boolean
	bigPopover?: boolean
	title?: string
	ariaDescribedBy?: string
}) {
	const engine = useEngine()
	const rule = engine.getRule(dottedName as DottedName)
	const références = useReferences(rule)
	const { t } = useTranslation()

	if (rule.rawNode.description == null) {
		return null
	}

	return (
		<HelpButtonWithPopover
			key={rule.dottedName}
			type="info"
			title={title ?? rule.title}
			light={light}
			bigPopover={bigPopover}
			className="print-hidden"
			aria-haspopup="dialog"
			aria-label={`Info sur ${rule.title}`}
			aria-describedby={ariaDescribedBy}
			{...props}
		>
			<Markdown>{rule.rawNode.description}</Markdown>

			<RuleLink
				dottedName={dottedName as DottedName}
				aria-label={t('Lire la documentation au sujet de :') + ' ' + rule.title}
			>
				Lire la documentation
			</RuleLink>

			{références && Object.keys(références).length > 0 && (
				<>
					<H3>Liens utiles</H3>
					<References references={références} />
				</>
			)}
			<Spacing xxl />
		</HelpButtonWithPopover>
	)
}
