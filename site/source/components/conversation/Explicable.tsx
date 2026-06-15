import { useTranslation } from 'react-i18next'

import { References } from '@/components/documentation/References/References'
import RuleLink from '@/components/RuleLink'
import { H3, InfoButton, Spacing } from '@/design-system'
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
		<InfoButton
			title={title ?? rule.title}
			description={rule.rawNode.description}
		>
			<RuleLink
				dottedName={dottedName as DottedName}
				aria-label={t(
					'components.règle.info.lien-documentation.aria-label',
					'Lire la documentation sur {{ règle }}',
					{ règle: rule.title }
				)}
			>
				{t(
					'components.règle.info.lien-documentation.texte',
					'Lire la documentation'
				)}
			</RuleLink>

			{références && Object.keys(références).length > 0 && (
				<>
					<H3>{t('components.règle.info.références', 'Liens utiles')}</H3>
					<References references={références} />
				</>
			)}
			<Spacing xxl />
		</InfoButton>
	)
}
