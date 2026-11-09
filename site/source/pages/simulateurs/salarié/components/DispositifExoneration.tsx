import { useTranslation } from 'react-i18next'

import RuleLink from '@/components/RuleLink'
import { FromTop } from '@/components/ui/animate'
import { DottedName } from '@/domaine/publicodes/DottedName'
import { useEngine } from '@/utils/publicodes/EngineContext'

import { MentionSousObjectif } from './MentionSousObjectif'

const DISPOSITIF = "salarié . dispositif d'exonération" as DottedName

export const DispositifExoneration = () => {
	const { t } = useTranslation()
	const engine = useEngine()
	const dispositif = engine.evaluate(DISPOSITIF).nodeValue

	if (typeof dispositif !== 'string') {
		return null
	}

	const titre = engine.getRule(
		`${DISPOSITIF} . choix . ${dispositif}` as DottedName
	).title

	return (
		<FromTop>
			<MentionSousObjectif>
				<RuleLink dottedName={DISPOSITIF}>
					{t(
						'pages.simulateurs.salarié.dispositif-exoneration',
						'Dispositif d’exonération : {{titre}}',
						{ titre }
					)}
				</RuleLink>
			</MentionSousObjectif>
		</FromTop>
	)
}
