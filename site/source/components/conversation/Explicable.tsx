import { useTranslation } from 'react-i18next'

import { References } from '@/components/documentation/References/References'
import RuleLink from '@/components/RuleLink'
import { H3, HelpButtonWithPopover, Markdown, Spacing } from '@/design-system'
import { DottedName } from '@/domaine/publicodes/DottedName'
import { useReferences } from '@/pages/assistants/choix-du-statut/résultat'
import { useEngine } from '@/utils/publicodes/EngineContext'

export function ExplicableRule<Names extends string = DottedName>({
	dottedName,
	title,
}: {
	dottedName: Names
	title?: string
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
			light
			className="print-hidden"
			aria-haspopup="dialog"
			aria-label={t(
				'components.règles.info.aria-label',
				'Info sur {{ règle }}',
				{ règle: rule.title }
			)}
		>
			<Markdown>{rule.rawNode.description}</Markdown>

			<RuleLink
				dottedName={dottedName as DottedName}
				aria-label={t(
					'components.règles.lien-documentation.aria-label',
					'Lire la documentation sur {{ règle }}',
					{ règle: rule.title }
				)}
			>
				{t(
					'components.règles.lien-documentation.texte',
					'Lire la documentation'
				)}
			</RuleLink>

			{références && Object.keys(références).length > 0 && (
				<>
					<H3>{t('components.règles.références', 'Liens utiles')}</H3>
					<References references={références} />
				</>
			)}
			<Spacing xxl />
		</HelpButtonWithPopover>
	)
}
