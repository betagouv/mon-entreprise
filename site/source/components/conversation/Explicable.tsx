import { useTranslation } from 'react-i18next'

import { RéférencesDeRègle, RésuméDeRègle } from '@/components/documentation'
import RuleLink from '@/components/RuleLink'
import { InfoButton } from '@/design-system'
import { DottedName } from '@/domaine/publicodes/DottedName'
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
	const { t } = useTranslation()

	if (rule.rawNode.description == null) {
		return null
	}

	return (
		<InfoButton subject={rule.title} popoverTitle={title}>
			<RésuméDeRègle engine={engine} dottedName={dottedName as DottedName} />

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

			<RéférencesDeRègle
				engine={engine}
				dottedName={dottedName as DottedName}
			/>
		</InfoButton>
	)
}
