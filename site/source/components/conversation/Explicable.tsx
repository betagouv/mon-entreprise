import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { documentationPublicodes } from '@/components/documentation/publicodes/documentationPublicodes'
import RuleLink from '@/components/RuleLink'
import { InfoButton, Spacing } from '@/design-system'
import { DottedName } from '@/domaine/publicodes/DottedName'
import { useEngine } from '@/utils/publicodes/EngineContext'

/** @deprecated Utiliser DocumentationInfoButton. */
export function ExplicableRule<Names extends string = DottedName>({
	dottedName,
	title,
}: {
	dottedName: Names
	title?: string
}) {
	const engine = useEngine()
	const rule = engine.getRule(dottedName as DottedName)
	const { t } = useTranslation()
	const { Résumé, Références } = useMemo(
		() => documentationPublicodes(() => engine, dottedName as DottedName),
		[engine, dottedName]
	)

	if (rule.rawNode.description == null) {
		return null
	}

	return (
		<InfoButton subject={rule.title} popoverTitle={title}>
			<Résumé />

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

			<Références />
			<Spacing xxl />
		</InfoButton>
	)
}
