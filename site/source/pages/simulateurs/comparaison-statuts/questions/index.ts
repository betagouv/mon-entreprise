import { GroupeDeQuestionsFournies } from '@/components/Simulateur/Questions/ComposantQuestionFournie'
import { SituationComparée } from '@/contextes/comparateur'

import { NatureActivitéQuestion } from './NatureActivitéQuestion'

export const questionsPrincipales = [NatureActivitéQuestion]

export const groupesDeQuestions: Record<
	string,
	GroupeDeQuestionsFournies<SituationComparée>
> = {
	affiliation: {
		titre: (t) =>
			t(
				'pages.simulateurs.comparaison-statuts.questions.groupe-activité.titre',
				'Activité'
			),
		// Réponse: RéponseAffiliation,
		liste: [NatureActivitéQuestion],
	},
}
