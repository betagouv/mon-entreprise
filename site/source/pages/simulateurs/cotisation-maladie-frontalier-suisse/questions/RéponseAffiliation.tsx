import * as O from 'effect/Option'
import { Trans } from 'react-i18next'

import { useFrontalierSuisse } from '@/contextes/frontalier-suisse'
import { ValeurDate } from '@/design-system'

export const RéponseAffiliation = () => {
	const { situation } = useFrontalierSuisse()

	const début = O.getOrUndefined(situation.dateAffiliation)
	const fin = O.getOrUndefined(situation.dateFinAffiliation)

	if (!début) {
		return null
	}

	return fin ? (
		<Trans i18nKey="pages.simulateurs.cotisation-maladie-frontalier-suisse.questions.groupe-affiliation.réponse-période">
			du <ValeurDate date={début} /> au <ValeurDate date={fin} />
		</Trans>
	) : (
		<Trans i18nKey="pages.simulateurs.cotisation-maladie-frontalier-suisse.questions.groupe-affiliation.réponse-depuis">
			depuis le <ValeurDate date={début} />
		</Trans>
	)
}
