import { GroupeDeQuestionsFournies } from '@/components/Simulateur/Questions/ComposantQuestionFournie'
import { SituationFrontalierSuisse } from '@/contextes/frontalier-suisse'

import { DateAffiliationQuestion } from './DateAffiliationQuestion'
import { DateFinAffiliationQuestion } from './DateFinAffiliationQuestion'
import { RéponseAffiliation } from './RéponseAffiliation'

export const questionsPrincipales = [DateAffiliationQuestion]

export const groupesDeQuestions: Record<
	string,
	GroupeDeQuestionsFournies<SituationFrontalierSuisse>
> = {
	affiliation: {
		titre: (t) =>
			t(
				'pages.simulateurs.cotisation-maladie-frontalier-suisse.questions.groupe-affiliation.titre',
				'Affiliation'
			),
		Réponse: RéponseAffiliation,
		liste: [DateAffiliationQuestion, DateFinAffiliationQuestion],
	},
}
